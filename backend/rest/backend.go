package rest

import (
	"encoding/json"
	"errors"
	"fmt"
	"github.com/syncloud/platform/event"
	"log"
	"net"
	"net/http"

	"github.com/syncloud/platform/backup"
	"github.com/syncloud/platform/job"
)

type Backend struct {
	Master       *job.Master
	backup       *backup.Backup
	eventTrigger *event.Trigger
	worker       *job.Worker
}

func NewBackend(master *job.Master, backup *backup.Backup, eventTrigger *event.Trigger, worker *job.Worker) *Backend {
	return &Backend{
		Master:       master,
		backup:       backup,
		eventTrigger: eventTrigger,
		worker:       worker,
	}
}

func (backend *Backend) Start(socket string) {
	go backend.worker.Start()
	http.HandleFunc("/job/status", Handle(http.MethodGet, backend.JobStatus))
	http.HandleFunc("/backup/list", Handle(http.MethodGet, backend.BackupList))
	http.HandleFunc("/backup/create", Handle(http.MethodPost, backend.BackupCreate))
	http.HandleFunc("/backup/restore", Handle(http.MethodPost, backend.BackupRestore))
	http.HandleFunc("/backup/remove", Handle(http.MethodPost, backend.BackupRemove))
	http.HandleFunc("/installer/upgrade", Handle(http.MethodPost, backend.InstallerUpgrade))
	http.HandleFunc("/storage/disk_format", Handle(http.MethodPost, backend.StorageFormat))
	http.HandleFunc("/storage/boot_extend", Handle(http.MethodPost, backend.StorageBootExtend))
	http.HandleFunc("/event/trigger", Handle(http.MethodPost, backend.EventTrigger))

	server := http.Server{}

	unixListener, err := net.Listen("unix", socket)
	if err != nil {
		panic(err)
	}
	log.Println("Started backend")
	_ = server.Serve(unixListener)

}

type Response struct {
	Success bool         `json:"success"`
	Message *string      `json:"message,omitempty"`
	Data    *interface{} `json:"data,omitempty"`
}

func fail(w http.ResponseWriter, err error) {
	appError := err.Error()
	response := Response{
		Success: false,
		Message: &appError,
	}
	responseJson, err := json.Marshal(response)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	} else {
		_, _ = fmt.Fprintf(w, string(responseJson))
	}
}

func success(w http.ResponseWriter, data interface{}) {
	response := Response{
		Success: true,
		Data:    &data,
	}
	responseJson, err := json.Marshal(response)
	if err != nil {
		fail(w, err)
	} else {
		_, _ = fmt.Fprintf(w, string(responseJson))
	}
}

func Handle(method string, f func(w http.ResponseWriter, req *http.Request) (interface{}, error)) func(w http.ResponseWriter, req *http.Request) {
	return func(w http.ResponseWriter, req *http.Request) {
		log.Printf("request: %s\n", req.URL.Path)
		if req.Method != method {
			fail(w, errors.New(fmt.Sprintf("wrong method %s, should be %s", req.Method, method)))
		}
		w.Header().Add("Content-Type", "application/json")
		data, err := f(w, req)
		if err != nil {
			fail(w, err)
		} else {
			success(w, data)
		}
	}
}

func (backend *Backend) BackupList(_ http.ResponseWriter, _ *http.Request) (interface{}, error) {
	return backend.backup.List()
}

func (backend *Backend) BackupRemove(_ http.ResponseWriter, req *http.Request) (interface{}, error) {
	file, ok := req.URL.Query()["file"]
	if !ok || len(file) < 1 {
		return nil, errors.New("file is missing")
	}
	err := backend.backup.Remove(file[0])
	if err != nil {
		return nil, err
	}
	return "removed", nil
}

func (backend *Backend) BackupCreate(_ http.ResponseWriter, req *http.Request) (interface{}, error) {
	apps, ok := req.URL.Query()["app"]
	if !ok || len(apps) < 1 {
		return nil, errors.New("app is missing")
	}
	_ = backend.Master.Offer(job.JobBackupCreate{App: apps[0]})
	return "submitted", nil
}

func (backend *Backend) BackupRestore(_ http.ResponseWriter, req *http.Request) (interface{}, error) {
	files, ok := req.URL.Query()["file"]
	if !ok || len(files) < 1 {
		return nil, errors.New("file is missing")
	}
	_ = backend.Master.Offer(job.JobBackupRestore{File: files[0]})
	return "submitted", nil
}

func (backend *Backend) InstallerUpgrade(_ http.ResponseWriter, _ *http.Request) (interface{}, error) {
	_ = backend.Master.Offer(job.JobInstallerUpgrade{})
	return "submitted", nil
}

func (backend *Backend) JobStatus(_ http.ResponseWriter, _ *http.Request) (interface{}, error) {
	return backend.Master.Status().String(), nil
}

func (backend *Backend) StorageFormat(_ http.ResponseWriter, req *http.Request) (interface{}, error) {
	if err := req.ParseForm(); err != nil {
		return nil, errors.New("cannot parse post form")
	}
	device := req.FormValue("device")
	_ = backend.Master.Offer(job.JobStorageFormat{Device: device})
	return "submitted", nil
}

func (backend *Backend) EventTrigger(_ http.ResponseWriter, req *http.Request) (interface{}, error) {
	if err := req.ParseForm(); err != nil {
		return nil, errors.New("cannot parse post form")
	}
	eventName := req.FormValue("event")
	return "ok", backend.eventTrigger.RunEventOnAllAps(eventName)
}

func (backend *Backend) StorageBootExtend(_ http.ResponseWriter, _ *http.Request) (interface{}, error) {
	_ = backend.Master.Offer(job.JobStorageBootExtend{})
	return "submitted", nil
}
