import * as _ from 'underscore';
import $ from 'jquery';
import jQuery from 'jquery';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-switch';
import 'bootstrap-switch/dist/css/bootstrap3/bootstrap-switch.css';
import 'font-awesome/css/font-awesome.css'
import '../css/site.css'
import '../css/material-icons.css'
import * as UiCommon from './ui/common.js'
import './ui/menu.js'
import toastr from 'toastr'
import 'toastr/build/toastr.css';

import * as Common from './common.js'
import {Grid} from "ag-grid-community";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-balham.css";

const gridOptions = {
    defaultColDef: {
        cellStyle: { 'text-align': "left" },
        
    },
    columnDefs: [
        {
            headerName: 'File',
            field: 'file',
            resizable: true,
            sortable: true,
            filter: true,
            filter: 'agTextColumnFilter'
        },
        {
            headerName: 'Actions',
            width: 100,
            resizable: false,
            cellRenderer: (params) => { 
              var div = document.createElement('div');
              div.innerHTML = `
                <i class='fa fa-undo' style='padding-left: 20px;  cursor:pointer;'></i>
                <i class='fa fa-trash' style='padding-left: 20px;  cursor:pointer;'></i>
             `;
              var buttons = div.querySelectorAll('i');
              buttons[0].addEventListener('click', () => { 
                $('#backup_file').val(params.data.file);
                $('#backup_action').val('restore');
                $('#confirm_caption').html('Restore');
                $('#confirm_question').html('Do you want to restore: ' + params.data.file + '?');
                $('#backup_action_confirmation').modal('show');
              }); 
              buttons[1].addEventListener('click', () => { 
                $('#backup_file').val(params.data.file);
                $('#backup_action').val('remove');
                $('#confirm_caption').html('Remove');
                $('#confirm_question').html('Do you want to remove: ' + params.data.file + '?');
                $('#backup_action_confirmation').modal('show');
              }); 
              return div;
            }
        },
      
    ],
    suppressDragLeaveHidesColumns: true,
    floatingFilter: true,
    domLayout: 'autoHeight'
};

function reload() {
    $.getJSON('/rest/backup/list')
      .done((response) => { 
        gridOptions.api.setRowData(response.data);
        gridOptions.api.sizeColumnsToFit();
      });
}

$( document ).ready(function () {
  if (typeof mock !== 'undefined') { console.log("backend mock") };
  UiCommon.check_activation_status();

  $("#btn_confirm").off('click').on('click', () => {
     
        var file = $('#backup_file').val();
        var action = $('#backup_action').val();
      
        if(action == 'restore') {
          $.get('/rest/backup/restore', { file: file }, () => { reload(); })
           .always((data) => {
            toastr.info("Restoring an app from a backup");
          
                Common.run_after_job_is_complete(
                    setTimeout,
                    () => {
                        toastr.info('Backup restore has finished');
                    },
                    UiCommon.ui_display_error_toast,
                    Common.JOB_STATUS_URL,
                    Common.JOB_STATUS_PREDICATE);
            
         })
         .fail(UiCommon.ui_display_error_toast);;
        } else if (action == 'remove') {
          $.get('/rest/backup/remove',{ file: file }, () => { reload(); })
           .fail(UiCommon.ui_display_error_toast);
        }
   });

  let eGridDiv = document.querySelector('#backupGrid');
  
  let grid = new Grid(eGridDiv, gridOptions);
  reload();
});
