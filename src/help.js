window.addEventListener("message", e => {
    if (e.data.superkeys) {
        let helpBody = document.getElementById('helpBody');
        let exampleGroup = document.getElementById('exampleGroup');
        let exampleShortcut = document.getElementById('exampleShortcut');

        Object.entries(e.data.superkeys).forEach(([groupName, shortcuts]) => {
            let group = exampleGroup.cloneNode(true)
            let tbody = group.querySelector('tbody');
            group.querySelector('.group').innerText = groupName
            tbody.innerHTML = ''

            shortcuts.forEach((config) => {
                let row = exampleShortcut.cloneNode(true)
                row.removeAttribute('id')
                row.querySelector('.trigger').innerText = config.trigger
                row.querySelector('.description').innerText = config.description
                tbody.appendChild(row)
            })

            helpBody.appendChild(group)
        })
    }
})

window.top.postMessage("superkeysHelpReady", "*")

let modal = document.getElementById('help')
new bootstrap.Modal(modal).show()
modal.addEventListener('hidden.bs.modal', () => window.top.postMessage("disposeSuperkeysHelp", "*"))