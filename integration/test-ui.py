import time
from os.path import dirname

from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait
from syncloudlib.integration.screenshots import screenshots

DIR = dirname(__file__)


def test_deactivate(device, device_host, artifact_dir):
    response = device.login().post('https://{0}/rest/settings/deactivate'.format(device_host), verify=False)
    assert '"success": true' in response.text
    assert response.status_code == 200


def test_activate(driver, ui_mode, device_host, screenshot_dir,
                  domain, device_user, device_password, redirect_user, redirect_password):
    driver.get("http://{0}".format(device_host))
    header = "//h1[text()='Activate']"
    wait_or_screenshot(driver, ui_mode, screenshot_dir, EC.presence_of_element_located((By.XPATH, header)))
    screenshots(driver, screenshot_dir, 'activate-empty')
    driver.find_element_by_id('redirect_email').send_keys(redirect_user)
    driver.find_element_by_id('redirect_password').send_keys(redirect_password)
    driver.find_element_by_id('user_domain').send_keys(domain)
    driver.find_element_by_id('device_username').send_keys(device_user)
    driver.find_element_by_id('device_password').send_keys(device_password)
    screenshots(driver, screenshot_dir, 'activate-ready')
    driver.find_element_by_id('btn_activate').click()
    header = "//h1[text()='Log in']"
    wait_or_screenshot(driver, ui_mode, screenshot_dir, EC.presence_of_element_located((By.XPATH, header)))


def test_activate_again(driver, ui_mode, device_host, screenshot_dir):
    driver.get("http://{0}/activate".format(device_host))
    header = "//h1[text()='Log in']"
    wait_or_screenshot(driver, ui_mode, screenshot_dir, EC.presence_of_element_located((By.XPATH, header)))
    screenshots(driver, screenshot_dir, 'activate')


def test_login(driver, ui_mode, device_host, screenshot_dir):
    driver.get("http://{0}".format(device_host))
    header = "//h1[text()='Log in']"
    wait_or_screenshot(driver, ui_mode, screenshot_dir, EC.presence_of_element_located((By.XPATH, header)))
    screenshots(driver, screenshot_dir, 'login-' + ui_mode)


def test_index(driver, ui_mode, device_user, device_password, screenshot_dir):
    user = driver.find_element_by_id("username")
    user.send_keys(device_user)
    password = driver.find_element_by_id("password")
    password.send_keys(device_password)
    login = driver.find_element_by_id("btn_login")
    login.click()
    screenshots(driver, screenshot_dir, 'index-progress-' + ui_mode)
    header = "//h1[text()='Applications']"
    wait_or_screenshot(driver, ui_mode, screenshot_dir, EC.presence_of_element_located((By.XPATH, header)))
    screenshots(driver, screenshot_dir, 'index-' + ui_mode)


def test_settings(driver, ui_mode, screenshot_dir):
    menu(driver, ui_mode, screenshot_dir, 'settings')
    header = "//h1[text()='Settings']"
    wait_or_screenshot(driver, ui_mode, screenshot_dir, EC.presence_of_element_located((By.XPATH, header)))
    screenshots(driver, screenshot_dir, 'settings-' + ui_mode)


def test_settings_activation(driver, ui_mode, screenshot_dir):
    settings(driver, screenshot_dir, ui_mode, 'activation')
    header = "//h1[text()='Activation']"
    wait_or_screenshot(driver, ui_mode, screenshot_dir, EC.presence_of_element_located((By.XPATH, header)))
    screenshots(driver, screenshot_dir, 'settings_activation-' + ui_mode)


def test_settings_access(driver, ui_mode, screenshot_dir):
    settings(driver, screenshot_dir, ui_mode, 'access')
    header = "//h1[text()='Access']"
    wait_or_screenshot(driver, ui_mode, screenshot_dir, EC.presence_of_element_located((By.XPATH, header)))
    screenshots(driver, screenshot_dir, 'settings_access-' + ui_mode)

    driver.find_element_by_id("external_mode").click()
    wait_or_screenshot(driver, ui_mode, screenshot_dir, EC.presence_of_element_located((By.ID, "ip_autodetect")))
    screenshots(driver, screenshot_dir, 'settings_access_external_access-' + ui_mode)


def test_settings_network(driver, ui_mode, screenshot_dir):
    settings(driver, screenshot_dir, ui_mode, 'network')
    header = "//h1[text()='Network']"
    wait_or_screenshot(driver, ui_mode, screenshot_dir, EC.presence_of_element_located((By.XPATH, header)))
    screenshots(driver, screenshot_dir, 'settings_network-' + ui_mode)


def test_settings_storage(driver, ui_mode, screenshot_dir):
    settings(driver, screenshot_dir, ui_mode, 'storage')
    header = "//h1[text()='Storage']"
    wait_or_screenshot(driver, ui_mode, screenshot_dir, EC.presence_of_element_located((By.XPATH, header)))
    screenshots(driver, screenshot_dir, 'settings_storage-' + ui_mode)


def test_settings_updates(driver, ui_mode, screenshot_dir):
    settings(driver, screenshot_dir, ui_mode, 'updates')
    header = "//h1[text()='Updates']"
    wait_or_screenshot(driver, ui_mode, screenshot_dir, EC.presence_of_element_located((By.XPATH, header)))
    screenshots(driver, screenshot_dir, 'settings_updates-' + ui_mode)


def test_settings_internal_memory(driver, ui_mode, screenshot_dir):
    settings(driver, screenshot_dir, ui_mode, 'internalmemory')
    header = "//h1[text()='Internal Memory']"
    wait_or_screenshot(driver, ui_mode, screenshot_dir, EC.presence_of_element_located((By.XPATH, header)))
    screenshots(driver, screenshot_dir, 'settings_updates-' + ui_mode)


def test_settings_support(driver, ui_mode, screenshot_dir):
    settings(driver, screenshot_dir, ui_mode, 'support')
    header = "//h1[text()='Support']"
    wait_or_screenshot(driver, ui_mode, screenshot_dir, EC.presence_of_element_located((By.XPATH, header)))
    screenshots(driver, screenshot_dir, 'settings_support-' + ui_mode)


def test_settings_backup(driver, ui_mode, screenshot_dir):
    settings(driver, screenshot_dir, ui_mode, 'backup')
    header = "//h1[text()='Backup']"
    wait_or_screenshot(driver, ui_mode, screenshot_dir, EC.presence_of_element_located((By.XPATH, header)))
    screenshots(driver, screenshot_dir, 'settings_backup-' + ui_mode)


def test_app_center(driver, ui_mode, screenshot_dir):
    menu(driver, ui_mode, screenshot_dir, 'appcenter')
    header = "//h1[text()='App Center']"
    wait_or_screenshot(driver, ui_mode, screenshot_dir, EC.presence_of_element_located((By.XPATH, header)))
    files = "//span[text()='File browser']"
    wait_or_screenshot(driver, ui_mode, screenshot_dir, EC.presence_of_element_located((By.XPATH, files)))
    screenshots(driver, screenshot_dir, 'appcenter-' + ui_mode)


def test_installed_app(driver, ui_mode, screenshot_dir):
    menu(driver, ui_mode, screenshot_dir, 'appcenter')
    header = "//h1[text()='App Center']"
    wait_or_screenshot(driver, ui_mode, screenshot_dir, EC.presence_of_element_located((By.XPATH, header)))
    files = "//span[text()='File browser']"
    wait_or_screenshot(driver, ui_mode, screenshot_dir, EC.presence_of_element_located((By.XPATH, files)))
    driver.find_element_by_xpath(files).click()
    header = "//h1[text()='File browser']"
    wait_or_screenshot(driver, ui_mode, screenshot_dir, EC.presence_of_element_located((By.XPATH, header)))
    screenshots(driver, screenshot_dir, 'app_installed-' + ui_mode)


def test_remove_app(driver, ui_mode, screenshot_dir):
    remove = 'btn_remove'
    wait_or_screenshot(driver, ui_mode, screenshot_dir, EC.presence_of_element_located((By.ID, remove)))
    driver.find_element_by_id(remove).click()
    confirm = 'btn_confirm'
    wait_or_screenshot(driver, ui_mode, screenshot_dir, EC.presence_of_element_located((By.ID, confirm)))
    driver.find_element_by_id(confirm).click()
    wait_or_screenshot(driver, ui_mode, screenshot_dir, EC.invisibility_of_element_located((By.ID, remove)))
    screenshots(driver, screenshot_dir, 'app_removed-' + ui_mode)


def test_install_app(driver, ui_mode, screenshot_dir):
    install = 'btn_install'
    wait_or_screenshot(driver, ui_mode, screenshot_dir, EC.presence_of_element_located((By.ID, install)))
    driver.find_element_by_id(install).click()
    confirm = 'btn_confirm'
    wait_or_screenshot(driver, ui_mode, screenshot_dir, EC.presence_of_element_located((By.ID, confirm)))
    driver.find_element_by_id(confirm).click()
    wait_or_screenshot(driver, ui_mode, screenshot_dir, EC.invisibility_of_element_located((By.ID, install)))
    screenshots(driver, screenshot_dir, 'app_installed-' + ui_mode)


def test_not_installed_app(driver, ui_mode, screenshot_dir):
    menu(driver, ui_mode, screenshot_dir, 'appcenter')
    nextcloud = "//span[text()='Nextcloud file sharing']"
    wait_or_screenshot(driver, ui_mode, screenshot_dir, EC.presence_of_element_located((By.XPATH, nextcloud)))
    driver.find_element_by_xpath(nextcloud).click()
    header = "//h1[text()='Nextcloud file sharing']"
    wait_or_screenshot(driver, ui_mode, screenshot_dir, EC.presence_of_element_located((By.XPATH, header)))
    screenshots(driver, screenshot_dir, 'app_not_installed-' + ui_mode)


def wait_or_screenshot(driver, ui_mode, screenshot_dir, method):
    wait_driver = WebDriverWait(driver, 30)
    try:
        wait_driver.until(method)
    except Exception as e:
        screenshots(driver, screenshot_dir, 'exception-' + ui_mode)
        raise e


def menu(driver, ui_mode, screenshot_dir, element_id):
    wait_driver = WebDriverWait(driver, 30)
    retries = 5
    retry = 0
    exception = None
    while retry < retries:
        try:
            find_id = element_id
            if ui_mode == "mobile":
                find_id = element_id + '_mobile'
                menubutton = driver.find_element_by_id('menubutton')
                menubutton.click()
                wait_driver.until(EC.visibility_of_element_located((By.ID, find_id)))
            wait_or_screenshot(driver, ui_mode, screenshot_dir, EC.element_to_be_clickable((By.ID, find_id)))
            screenshots(driver, screenshot_dir, element_id + '-' + ui_mode)
            element = driver.find_element_by_id(find_id)
            element.click()
            if ui_mode == "mobile":
                wait_driver.until(EC.invisibility_of_element_located((By.ID, find_id)))
            return
        except Exception as e:
            exception = e
            print('error (attempt {0}/{1}): {2}'.format(retry + 1, retries, str(e)))
            time.sleep(1)
        retry += 1
    raise exception


def settings(driver, screenshot_dir, ui_mode, setting):
    menu(driver, ui_mode, screenshot_dir, 'settings')
    wait_or_screenshot(driver, ui_mode, screenshot_dir, EC.element_to_be_clickable((By.ID, setting)))
    setting = driver.find_element_by_id(setting)
    setting.click()
