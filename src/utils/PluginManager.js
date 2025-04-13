/* 
This file is part of Shahneshan.

Copyright (C) 2024 shahrooz saneidarani (github.com/shahroozD)

Shahneshan is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

Shahneshan is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

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