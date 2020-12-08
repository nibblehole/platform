import time
from os.path import dirname

from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait
from syncloudlib.integration.screenshots import screenshots

DIR = dirname(__file__)


def test_activate(driver, ui_mode, device_host, screenshot_dir):
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
    user = driver.find_element_by_id("name")
    user.send_keys(device_user)
    password = driver.find_element_by_id("password")
    password.send_keys(device_password)
    password.submit()
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
    screenshots(driver, screenshot_dir, 'appcenter-' + ui_mode)


def test_installed_app(driver, device_host, ui_mode, screenshot_dir):
    driver.get("http://{0}/app?id=files".format(device_host))
    header = "//h1[text()='File browser']"
    wait_or_screenshot(driver, ui_mode, screenshot_dir, EC.presence_of_element_located((By.XPATH, header)))
    screenshots(driver, screenshot_dir, 'app_installed-' + ui_mode)


def test_not_installed_app(driver, device_host, ui_mode, screenshot_dir):
    driver.get("http://{0}/app?id=nextcloud".format(device_host))
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
    retries = 5
    retry = 0
    while retry < retries:
        try:
            find_id = element_id
            if ui_mode == "mobile":
                find_id = element_id + '_mobile'
                navbar = driver.find_element_by_id('navbar')
                navbar.click()
            wait_or_screenshot(driver, ui_mode, screenshot_dir, EC.element_to_be_clickable((By.ID, element_id)))
            screenshots(driver, screenshot_dir, element_id + '-' + ui_mode)
            element = driver.find_element_by_id(find_id)
            element.click()
            if ui_mode == "mobile":
                navbar = driver.find_element_by_id('navbar')
                navbar.click()
            return
        except Exception as e:
            print('error (attempt {0}/{1}): {2}'.format(retry + 1, retries, e.message))
            time.sleep(1)
        retry += 1


def settings(driver, screenshot_dir, ui_mode, setting):
    menu(driver, ui_mode, screenshot_dir, 'settings')
    wait_or_screenshot(driver, ui_mode, screenshot_dir, EC.element_to_be_clickable((By.ID, setting)))
    setting = driver.find_element_by_id(setting)
    setting.click()
