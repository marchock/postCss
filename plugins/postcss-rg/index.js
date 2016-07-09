var postcss = require('postcss'),
    _ = require('lodash'),
    utils = require('./utils.js');


module.exports = postcss.plugin('mq-grid', () => {

    /**********************************************************
     * GENERATE GRIDS
     **********************************************************/

    return (css) => {

        // Defualt Values
        var opts = utils.gridDefaultOptions();

        // Defualt Values
        var breakpoints = utils.breakpointsDefaults();

        // find mq-breakpoints
        css.walkAtRules('mq-breakpoints', (createBreakpoints) => {
            createBreakpoints.walkDecls((decl) => {
                // Get breakpoint values from @mq-breakpoints
                breakpoints[decl.prop] = decl.value;
            });
        });

        css.walkAtRules('mq-create-grid', (createGrid) => {
            createGrid.walkDecls((decl) => {
                // Get grid parameters from @mq-create-grid
                opts[decl.prop] = decl.value;
            });

            // Generate Grids
            const gridClass = opts.gridClass;
            const columnClass = opts.columnClass || null;
            const gridStart = opts.gridStart || null;
            const gridCustom = opts.gridCustom || null;
            const columns = Number(opts.columns);
            const width = Number(opts.width); // px
            const margin = Number(opts.margin); // px
            const gutter = Number(opts.gutter * 2); // px
            const structureWidth = width - gutter; // px
            const gutterWidth = utils.getGutterWidth(gutter, width); // %
            const marginWidth = utils.getMarginWidth(margin, structureWidth); // %
            const maxWidth = structureWidth + margin; // px

            var rootCss = postcss.root();

            rootCss.append(`
               .${gridClass} {
                    margin: 0 auto;
                    max-width: ${maxWidth}px;
                    width: ${(100 - gutterWidth) + (marginWidth * 2)}%;
                }
            `);
            rootCss.append(`
                .${gridClass}.no-cols {
                    max-width: ${structureWidth}px;
                    width: ${100 - gutterWidth}%;
                }
            `);

            rootCss.append(`
                .${gridClass}::after {
                    content: "";
                    display: table;
                    clear: both;
                }
            `);

            if (columns > 1) {
                // NOT CUSTOM GRID
                if(!gridCustom) {

                    // ----------------------------------------------------
                    // TYPE STRUCTURE GRID
                    // ----------------------------------------------------

                    // all col elements 100%
                    rootCss.append(`
                        .${gridClass} [class*='col-'] {
                            margin: 0 ${marginWidth}% ${marginWidth*2}%;
                            width: ${utils.getWidth(columns, columns, marginWidth)}%;
                        }
                    `);

                    rootCss.append(`
                        @media (min-width:${breakpoints[gridStart]}){
                            .${gridClass} [class*="col-"] {
                              float: left;
                            }

                            .${gridClass} .a-r {
                                float: right;
                            }

                            .${gridClass} .a-c {
                                float: none;
                                margin-left: auto;
                                margin-right: auto;
                            }

                            .${gridClass}.i-b {
                                font-size: 0;
                            }
                            .${gridClass}.i-b [class*="col-"] {
                                float: none;
                                display: inline-block;
                                vertical-align: top;
                            }

                            ${utils.calcColumns(gridClass, columns, marginWidth)}
                        }
                    `);
                }

                else {

                    // ----------------------------------------------------
                    // TYPE ADAPTIVE GRID
                    // ----------------------------------------------------

                    // Convert the custom grid into an object
                    var gridCustomRegex = gridCustom.match(/{([^]+?)}/);
                    var gridCustomObject = JSON.parse(gridCustomRegex[0]);

                    rootCss.append(`
                        .${columnClass} {
                            margin: 0 ${marginWidth}% ${marginWidth*2}%;
                            width: ${utils.getWidth(columns, columns, marginWidth)}%;
                        }

                        .${gridClass} .a-r {
                            float: right;
                        }

                        .${gridClass} .a-c {
                            float: none;
                            margin-left: auto;
                            margin-right: auto;
                        }

                        .${gridClass}.i-b {
                            font-size: 0;
                        }
                        .${gridClass}.i-b ${columnClass} {
                            float: none;
                            display: inline-block;
                            vertical-align: top;
                        }
                    `);

                    for (var prop in gridCustomObject) {
                        var breakpointName = prop;
                        var breakpointColumn = gridCustomObject[prop];

                        rootCss.append(`
                            @media (min-width:${breakpoints[breakpointName]}){
                                .${columnClass} {
                                  float: left;
                                  width: ${utils.getWidth(1, breakpointColumn, marginWidth)}%;
                                }
                            }
                        `);
                    }
                }
            }
            createGrid.replaceWith(rootCss);
        });
    }
});