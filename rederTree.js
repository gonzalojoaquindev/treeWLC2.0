alert('Creando árbol Mesh')
    //Renderizar arbol
const data = WLC
console.log(data)

const body = document.querySelector("body");

body.innerHTML = ""
    /* 
    const arbol = document.createElement("div")
    const arbolContent = arbol.innerHTML = `hola mundo ${jsonWLC}`
    document.body.insertAdjacentHTML('hola umundo mundial')
     */
    /* document.write(jsonWLC) */


const margin = ({ top: 10, right: 120, bottom: 10, left: 40 })
const width = window.innerWidth
const dx = 12
const dy = width / 6


const tree = d3.tree().nodeSize([dx, dy])

const diagonal = d3.linkHorizontal().x(d => d.y).y(d => d.x)

function chart(data, tree, dx, dy, margin, d3, width) {
    const root = d3.hierarchy(data);
    /*   console.log(tree(root)) */
    root.x0 = dy / 2;
    root.y0 = 0;
    root.descendants().forEach((d, i) => {
        d.id = i;
        d._children = d.children;
        if (d.depth && d.data.name.length !== 7) d.children = null;
    });

    const svg = d3.select("body").append("svg")
        .attr("viewBox", [-margin.left, -margin.top, width, dx])
        .style("font", "12px sans-serif")
        .style("user-select", "none");

    const gLink = svg.append("g")
        .attr("fill", "none")
        .attr("stroke", "#B0BEC5")
        .attr("stroke-opacity", 0.4)
        .attr("stroke-width", 1.5);

    const gNode = svg.append("g")
        .attr("cursor", "pointer")
        .attr("pointer-events", "all");

    function update(source) {
        const duration = d3.event && d3.event.altKey ? 2500 : 250;
        const nodes = root.descendants().reverse();
        const links = root.links();

        // Compute the new tree layout.
        tree(root);

        let left = root;
        let right = root;
        root.eachBefore(node => {
            if (node.x < left.x) left = node;
            if (node.x > right.x) right = node;
        });

        const height = right.x - left.x + margin.top + margin.bottom;

        const transition = svg.transition()
            .duration(duration)
            .attr("viewBox", [-margin.left, left.x - margin.top, width, height])
            .tween("resize", window.ResizeObserver ? null : () => () => svg.dispatch("toggle"));

        // Update the nodes…
        const node = gNode.selectAll("g")
            .data(nodes, d => d.id);

        // Enter any new nodes at the parent's previous position.
        const nodeEnter = node.enter().append("g")
            .attr("transform", d => `translate(${source.y0},${source.x0})`)
            .attr("fill-opacity", 0)
            .attr("stroke-opacity", 0)
            .on("click", (event, d) => {
                console.log(d)
                d.children = d.children ? null : d._children;
                update(d);

            })






        nodeEnter.append("circle")
            .attr("r", 2.8)
            .attr("fill", d => d._children ? "#999" : "#555")
            .attr("stroke-width", 10);

        nodeEnter.append("text")
            .attr("fill", "#f5f5f5")
            .attr("dy", "0.31em")
            .attr("x", d => d._children ? -6 : 6)
            .attr("text-anchor", d => d._children ? "end" : "start")
            .text(d => d.data.name)
            .clone(true).lower()
            .attr("stroke-linejoin", "round")
            .attr("stroke-width", 3)
            .attr("stroke", "#263238");

        // Transition nodes to their new position.
        const nodeUpdate = node.merge(nodeEnter).transition(transition)
            .attr("transform", d => `translate(${d.y},${d.x})`)
            .attr("fill-opacity", 1)
            .attr("stroke-opacity", 1);

        // Transition exiting nodes to the parent's new position.
        const nodeExit = node.exit().transition(transition).remove()
            .attr("transform", d => `translate(${source.y},${source.x})`)
            .attr("fill-opacity", 0)
            .attr("stroke-opacity", 0);

        // Update the links…
        const link = gLink.selectAll("path")
            .data(links, d => d.target.id);

        // Enter any new links at the parent's previous position.
        const linkEnter = link.enter().append("path")
            .attr("d", d => {
                const o = { x: source.x0, y: source.y0 };
                return diagonal({ source: o, target: o });
            });

        // Transition links to their new position.
        link.merge(linkEnter).transition(transition)
            .attr("d", diagonal);

        // Transition exiting nodes to the parent's new position.
        link.exit().transition(transition).remove()
            .attr("d", d => {
                const o = { x: source.x, y: source.y };
                return diagonal({ source: o, target: o });
            });

        // Stash the old positions for transition.
        root.eachBefore(d => {
            d.x0 = d.x;
            d.y0 = d.y;
        });
    }

    update(root);

    return svg.node();
}

chart(data, tree, dx, dy, margin, d3, width)

document.body.insertAdjacentHTML('beforeend', '<div id="by">By Gonzalo Araya Romero</div>')