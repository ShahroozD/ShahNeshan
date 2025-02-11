class PluginManager {
    constructor() {
        this.plugins = [];
    }

    addPlugin(plugin) {
        if (!this.plugins.includes(plugin)) {
            this.plugins.push(plugin);
        }
    }

    // Other plugin manager methods remain the same
    applyBeforeParse(text) {
        return this.plugins.reduce((txt, plugin) =>
            plugin.beforeParse ? plugin.beforeParse(txt) : txt,
        text);
    }

    applyNodeTransform(node) {
        return this.plugins.reduce((nd, plugin) =>
            plugin.nodeTransform ? plugin.nodeTransform(nd) : nd,
        node);
    }

    applyAfterParse(html) {
        return this.plugins.reduce((htmlText, plugin) =>
            plugin.afterParse ? plugin.afterParse(htmlText) : htmlText,
        html);
    }
    
    // hook for when the HTML is already in the DOM
    applyAfterRender(domElement) {
        this.plugins.forEach(plugin => {
            if (plugin.afterRender) {
                plugin.afterRender(domElement);
            }
        });
    }
}

export default PluginManager;