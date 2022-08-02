//capturo los elementos
el = document.getElementsByClassName('listNoPad')
for (let step = 0; step < el.length; step = step + 16) {
    const IP = el[1 + step].children[0].value
    const AP = el[2 + step].children[0].value
    if (clients.findIndex(client => client.IP == IP) >= 0) {
        const index = clients.findIndex(client => client.IP == IP)
        el[5 + step].children[0].value = clients[index].hostname
        clients[index].AP = AP
    } else {
        clients.push({ IP: IP, hostname: 'indefinido', AP: AP })
    }
}



const clientsActive = clients.filter(n => n.AP !== '')

//armo el arbol

const WLC = {
    name: "WLC",
    children: []
}

const getRap = () => {
    const RAP = clients.filter(n => n.AP === "WLC")
    RAP.map(n => WLC.children.push({ name: n.hostname, children: [] }))
}
getRap()

WLC.children.forEach(nodo => {
    Object.value
    const children = clientsActive.filter(n => n.AP === nodo.name)
    children.map(n => {
        nodo.children.push({ name: n.hostname, children: [] })

    })
    nodo.children.forEach(nodo => {
        const children2 = clientsActive.filter(n => n.AP === nodo.name)
        children2.map(n => {
            nodo.children.push({ name: n.hostname, children: [] })
        })
        nodo.children.forEach(nodo => {
            const children3 = clientsActive.filter(n => n.AP === nodo.name)
            children3.map(n => {
                nodo.children.push({ name: n.hostname, children: [] })
            })
        })


    })
})

/* const jsonWLC = JSON.stringify(WLC) */