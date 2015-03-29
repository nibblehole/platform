from os.path import join
import tempfile
import shutil

import responses

from syncloud.insider.facade import get_insider
from test.insider.helpers import insider_config_file, insider_config_file_name


@responses.activate
def test_get_service():

    temp_folder = tempfile.mkdtemp()
    shutil.copyfile(insider_config_file, join(temp_folder, insider_config_file_name))

    responses.add(responses.POST,
                  "http://domain.com/domain/acquire",
                  body='{"user_domain": "boris", "update_token": "some_update_token"}')

    responses.add(responses.POST, "http://domain.com/domain/update", status=200)

    insider = get_insider(config_path=temp_folder, use_upnpc_mock=True)
    insider.set_redirect_info('domain.com', 'http://domain.com')
    insider.acquire_domain('email', 'password', 'user_domain')
    insider.add_service('name', 'protocol', 'type', 80, 'url')

    service = insider.get_service('name')

    assert service.name == 'name'
    assert service.protocol == 'protocol'
    assert service.type == 'type'
    assert service.port == 80
    assert service.url == 'url'

    endpoint = insider.service_info('name')

    assert endpoint.external_host == 'boris.domain.com'
    assert endpoint.external_port == 80

    assert insider.full_name() == 'boris.domain.com'