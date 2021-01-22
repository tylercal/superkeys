function error(message) {
    feedback("error", message)
}

function message(message) {
    feedback("message", message)
}

function feedback(show, message) {
    let last = document.querySelector('.alert.on')
    if (last) new bootstrap.Alert(last).close()
    let example = document.getElementById(show);
    let box = example.cloneNode(true);
    box.classList.remove('d-none')
    box.classList.add('on')
    box.removeAttribute('id')
    box.querySelector('.message').innerText = message
    example.parentNode.insertBefore(box, example)
}

function restoreOptions() {
    chrome.storage.sync.get(results => {
        Object.entries(results).forEach(result => {
            const key = result[0]
            const config = result[1]
            if (typeof config === 'string') {
                document.getElementById('helpShortcut').value = config
            } else {
                renderGroup(key, config)
            }
        })
    });
}

function removeGroup() {
    const group = this.closest('.accordion-item')
    const key = group.querySelector('.group-name').value
    chrome.storage.sync.remove([key], () => {
        if (chrome.runtime.lastError) {
            error("Couldn't remove "+key+", "+chrome.runtime.lastError.message)
        } else {
            message(key+ " removed")
            group.remove()
        }
    })
}

function saveGroup() {
    const group = this.closest('.accordion-body')
    const key = group.querySelector('.group-name').value
    this.closest('.accordion-item').querySelector('.accordion-button').innerText = key
    const config = {
        filters: group.querySelector('.filters').value.split("\n"),
        shortcuts: []
    }

    group.querySelectorAll('.shortcut').forEach(form => {
        const shortcut = {}
        let filled = true
        ;["description", "trigger", "script"].forEach(field => {
            let value = form.querySelector('.'+field).value;
            filled &&= value !== ""
            shortcut[field] = value
        })
        if (filled) config.shortcuts.push(shortcut)
    })

    chrome.storage.sync.set({[key]: config}, () => {
        this.closest('.accordion-item').querySelector('.accordion-button').click()
        if (chrome.runtime.lastError) {
            error("Couldn't save "+key+", "+chrome.runtime.lastError.message)
        } else {
            message(key+ " saved")
        }
    })
}

let idSeq = 0

function renderGroup(key="", config={filters: [], shortcuts: []}) {
    let form = document.getElementById("shortcuts")
    let group = document.getElementById("example-group").cloneNode(true)
    group.removeAttribute('id')
    group.classList.remove('d-none')
    let groupButton = group.querySelector('.accordion-button');

    if (typeof key === 'string') {
        group.querySelector('.group-name').value = key
        groupButton.innerText = key
    } else {
        groupButton.innerText = 'New Group'
    }

    groupButton.dataset.bsTarget = "#id-"+idSeq
    group.querySelector('#example-body').id = "id-"+idSeq++


    group.querySelector('.filters').value = config.filters.join("\n")

    let groupBody = group.querySelector('.accordion-body');

    if (config.shortcuts.length > 0) {
        config.shortcuts.forEach(config => renderShortcut(groupBody, config))
    } else {
        renderShortcut(groupBody)
    }

    group.querySelector('.save').addEventListener('click', saveGroup)
    group.querySelector('.add').addEventListener('click', addShortcut)
    group.querySelector('.remove').addEventListener('click', removeGroup)

    if (typeof key !== 'string') {
        form.prepend(group)
        groupButton.click()
    } else {
        form.append(group)
    }
}

function addShortcut() {
    renderShortcut(this.closest('.accordion-body'))
}


function renderShortcut(group, config) {
    let shortcut = group.querySelector("#example-shortcut");
    if (!shortcut) {
        shortcut = document.getElementById("example-shortcut").cloneNode(true)
    }
    shortcut.removeAttribute("id")
    shortcut.querySelector('.remove-shortcut').addEventListener('click', removeShortcut)
    group.insertBefore(shortcut, group.querySelector('.save-row'))

    if (config) {
        ["description", "trigger", "script"].forEach(field => {
            shortcut.querySelector('.'+field).value = config[field];
        })
    } else {
        shortcut.querySelector('.trigger').focus()
    }
}

function removeShortcut() {
    this.closest('.shortcut').remove()
}

function saveHelp() {
    let helpShortcut = document.getElementById('helpShortcut').value;
    chrome.storage.sync.set({help: helpShortcut}, () => {
        if (chrome.runtime.lastError) {
            error("Couldn't save "+helpShortcut+", "+chrome.runtime.lastError.message)
        } else {
            message(helpShortcut + " saved")
        }
    })
}


document.getElementById('add-group').addEventListener('click', renderGroup)
document.getElementById('saveHelp').addEventListener('click', saveHelp)

document.addEventListener('DOMContentLoaded', restoreOptions);