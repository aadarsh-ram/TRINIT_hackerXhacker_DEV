import requests

def check_green_host(hostname):
    """Check if the host is green"""
    if (hostname is None or hostname == ""):
        return 0
    base_url = f"https://api.thegreenwebfoundation.org/api/v3/greencheck/{hostname}"
    response = requests.get(base_url)
    if (response.status_code != 200):
        # If the host is not found, assume it is not green
        return 0
    return 1 if response.json()["green"] == 'true' else 0

def get_co2_emission(bytes, green):
    """Get the co2 emission of the host"""
    base_url = f"https://api.websitecarbon.com/data?bytes={bytes}&green={green}"
    response = requests.get(base_url)
    statistics = response.json()["statistics"]

    # Get the green category
    if response.json()["cleanerThan"] >= 0.66:
        green_category = "green"
    elif 0.33 <= response.json()["cleanerThan"] < 0.66:
        green_category = "semi-green"
    else:
        green_category = "non-green"

    edited_response = {
        "co2_renewable_grams": statistics["co2"]["renewable"]["grams"],
        "co2_grid_grams": statistics["co2"]["grid"]["grams"],
        "energy_kwg": statistics["energy"],
        "category": green_category,
    }
    return edited_response