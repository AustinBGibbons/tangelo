/*jslint browser: true */

/*global $, d3 */

/**
 *
 * @fileOverview Defines the global namespace <i>tangelo</i> and provides a
 * top-level utilities.
 */

/**
 * @namespace The global namespace for all XDATA Web javascript utilities.
 */
var tangelo = {};

(function () {
    "use strict";

    /** Creates namespaces nested within <i>tangelo</i> as appropriate.
     *
     * @param {string} ns_spec A string describing a namespace path, like
     * "utilities.UI".  This path of namespaces will be created by this
     * function, embedded implicitly within the <i>tangelo</i> namespace - i.e.,
     * <i>tangelo.utilities.UI</i> would be a valid namespace after running this
     * function.  If some of the namespaces in the path already exist, the
     * function will simply continue within those namespace containers as though
     * they had just been created by the function.
     *
     * @returns {namespace} The namespace container corresponding to
     * <i>ns_spec</i>.
     */
    tangelo.namespace = function (ns_spec) {
        var ns_path,
            mod,
            messageFunction,
            namingFunction,
            i,
            path_component;

        namingFunction = function (name) {
            return function () {
                return name;
            };
        };

        messageFunction = function (name) {
            return function (f, m) {
                return "[" + name + "." + f + "] " + m;
            };
        };

        ns_path = ns_spec.split(".");

        mod = tangelo;
        mod.name = namingFunction("tangelo");
        mod.message = messageFunction(mod.name());
        for (i = 0; i < ns_path.length; i += 1) {
            path_component = ns_path[i];

            mod[path_component] = mod[path_component] || {};
            mod = mod[path_component];
            mod.name = namingFunction("tangelo." + ns_path.slice(0, i + 1));
            mod.message = messageFunction(mod.name());
        }

        return mod;
    };

    // Initialization function that will handle tangelo-specific elements
    // automatically.
    $(function () {
        var brand,
            i,
            initialize_control_panel,
            initialize_file_dialog,
            initialize_navbar,
            item,
            items;

        // Callback specifier for clicking the "save config" button in the
        // standard tangelo config panel.
        tangelo.onConfigSave = function (callback) {
            d3.select("#tangelo-config-submit")
                .on("click.tangelo", callback);
        };

        // Callback specifier for bringing up the tangelo config panel (e.g. by
        // clicking on the navbar item).
        tangelo.onConfigLoad = function (callback) {
            $("#tangelo-config-panel").on("show.tangelo", callback);
        };

        // Callback specifier for clicking the "defaults" button in the standard
        // tangelo config panel.
        tangelo.onConfigDefault = function (callback) {
            d3.select("#tangelo-config-defaults")
                .on("click.tangelo", callback);
        };

        // Create bootstrap-styled navbar at top of screen.
        initialize_navbar = function (s) {
            var footer,
                navbar_inner,
                modal,
                oktext,
                selection,
                type,
                ul,
                x;

            // Bail out if the selection is empty.
            if (s.empty()) {
                console.log("initialize_navbar: input selection was empty!");
                return;
            }

            // Convert the top-level element into a bootstrap navbar element,
            // then embed a "navbar-inner" div within it.
            navbar_inner = s.classed("navbar", true)
                .classed("navbar-fixed-top", true)
                .append("div")
                    .classed("navbar-inner", true);

            // Create a "brand" item if requested.
            brand = s.attr("data-tangelo-brand");
            if (brand !== null) {
                navbar_inner.append("a")
                    .classed("brand", true)
                    .attr("href", s.attr("data-tangelo-brand-href"))
                    .text(brand);
            }

            // Create an unordered list for holding the navbar contents.
            ul = navbar_inner.append("ul")
                    .classed("nav", true);

            // Create an app name item if requested.
            if (s.attr("data-tangelo-app") !== null) {
                ul.append("li")
                    .classed("active", true)
                    .append("a")
                        .text(s.attr("data-tangelo-app"));
            }

            // Each top-level div inside the navbar div represents list-item
            // content for the navbar.  One by one, handle them as necessary and
            // add an appropriate li to the list.
            //
            // Start by forming an array of single-element selections out of the
            // full list.
            items = s.selectAll("[data-tangelo-type]")[0].map(d3.select);

            // Go through and check the type field, taking approriate action for
            // each.
            for (i = 0; i < items.length; i += 1) {
                item = items[i];
                type = item.attr("data-tangelo-type");

                if (type === "info") {
                    ul.append("li")
                        .append("a")
                        .classed("pointer", true)
                        .attr("data-toggle", "modal")
                        .attr("data-target", "#tangelo-info-panel")
                        .html("<i class=icon-info-sign></i> Info");

                    modal = d3.select(document.body)
                        .insert("div", ":first-child")
                        .attr("id", "tangelo-info-panel")
                        .classed("modal", true)
                        .classed("hide", true)
                        .classed("fade", true);

                    x = modal.append("div")
                        .classed("modal-header", true);
                    x.append("button")
                        .attr("type", "button")
                        .classed("close", true)
                        .attr("data-dismiss", "modal")
                        .attr("aria-hidden", true)
                        .html("&times;");
                    x.append("h3")
                        .text("Information");

                    modal.append("div")
                        .classed("modal-body", true)
                        .html(item.html());

                    oktext = item.attr("data-tangelo-ok-button") || "";
                    modal.append("div")
                        .classed("modal-footer", true)
                        .append("a")
                            .classed("btn", true)
                            .attr("data-dismiss", "modal")
                            .text(oktext === "" ? "OK" : oktext);

                    item.remove();

                } else if (type === "config") {
                    ul.append("li")
                        .append("a")
                        .classed("pointer", true)
                        .attr("data-toggle", "modal")
                        .attr("data-target", "#tangelo-config-panel")
                        .html("<i class=icon-cog></i> Config");

                    modal = d3.select(document.body)
                        .insert("div", ":first-child")
                        .attr("id", "tangelo-config-panel")
                        .classed("modal", true)
                        .classed("hide", true)
                        .classed("fade", true);

                    x = modal.append("div")
                        .classed("modal-header", true);
                    x.append("button")
                        .attr("type", "button")
                        .classed("close", true)
                        .attr("data-dismiss", "modal")
                        .attr("aria-hidden", true)
                        .html("&times;");
                    x.append("h3")
                        .text("Configuration");

                    modal.append("div")
                        .classed("modal-body", true)
                        .html(item.html());

                    oktext = item.attr("data-tangelo-cancel-button") || "";
                    footer = modal.append("div")
                        .classed("modal-footer", true);
                    footer.append("a")
                        .attr("id", "tangelo-config-cancel")
                        .classed("btn", true)
                        .attr("data-dismiss", "modal")
                        .text(oktext === "" ? "Cancel" : oktext);
                    footer.append("a")
                        .attr("id", "tangelo-config-defaults")
                        .classed("btn", true)
                        .text("Defaults");
                    footer.append("a")
                        .attr("id", "tangelo-config-submit")
                        .classed("btn", true)
                        .classed("btn-primary", true)
                        .attr("data-dismiss", "modal")
                        .text(oktext === "" ? "Save changes" : oktext);

                    item.remove();
                } else if (type === "other") {
                    // TODO(choudhury): implement this code path.
                    throw "navbar item type 'other' currently unimplemented";
                } else {
                    throw "unknown navbar item type '" + type + "'";
                }
            }
        };

        initialize_navbar(d3.select("[data-tangelo-type=navbar]"));

        // Create CSS styled control panel at bottom of screen.
        initialize_control_panel = function (s) {
            var toggle;

            // Bail out if the selection is empty.
            if (s.empty()) {
                console.log("initialize_control_panel: input selection was empty!");
                return;
            }

            // Style the control panel div appropriately, then add a div as the
            // first child to act as the drawer handle (and place an appropriate
            // icon in the middle of it).
            s.attr("id", "tangelo-control-panel")
                .classed("control-panel", true)
                .insert("div", ":first-child")
                    .attr("id", "tangelo-drawer-handle")
                    .classed("centered", true)
                    .classed("pointer", true)
                    .classed("drawer", true)
                    .append("i")
                        .attr("id", "tangelo-drawer-icon")
                        .classed("icon-chevron-down", true);

            toggle = tangelo.util.drawer_toggle("#tangelo-control-panel", "#tangelo-drawer-icon");
            d3.select("#tangelo-drawer-handle")
                .on("click", toggle);
        };

        initialize_control_panel(d3.select("[data-tangelo-type=control-panel]"));

        // A nicer file dialog widget (based on
        // http://duckranger.com/2012/06/pretty-file-input-field-in-bootstrap/).
        initialize_file_dialog = function (s) {
            var id,
                style,
                d;

            s = d3.select(s);

            // Grab the id and style attributes.
            id = s.attr("id") || "";
            style = s.property("style");

            // Make the element invisible, give it a new id, and set it to
            // "receive updates" from the visible text element.
            s.style("display", "none")
                .attr("id", id + "_tangelo")
                .on("change", function () {
                    $("#" + id).val($(this).val());
                });

            // Create a new element.
            d = d3.select(document.createElement("div"))
                    .classed("input-append", true);
            d.append("input")
                .attr("id", id)
                .attr("type", "text")
                .classed("input-large", true);
            d.append("a")
                .classed("btn", true)
                .on("click", function () {
                    $("input#" + id + "_tangelo").click();
                });

            s.each(function () {
                this.parentNode.insertBefore(d.node(), this.nextSibling);
            });
        };

        $.each(d3.selectAll("input[type=file]")[0], function (i, v) {
            initialize_file_dialog(v);
        });
    });
}());
