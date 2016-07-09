 module.exports = {

    gridDefaultOptions: function () {
        return {
            gridClass: 'grid',
            width: 1280,
            gutter: 40,
            margin: 16,
            columns: 12,
            gridStart: 'tablet',
            gridCustom: null,
            columnClass: null
        };
    },

    breakpointsDefaults: function () {
        return {
            mobile: '320px',
            tablet: '481px',
            smalldesktop: '769px',
            desktop: '1024px',
            largedesktop: '1280px'
        };
    },

    getGutterWidth: function (gutter, width) {
        return (gutter / width) * 100; // %
    },

    getMarginWidth: function (margin, width) {
        return (((margin / 2) / width) * 100); // %
    },

    getWidth: function (columnCount, totalColumns, margin) {
        const columnWidth = (100 - ((margin * 2) * totalColumns)) / totalColumns;
        return (columnCount * columnWidth) + ((margin * 2) * (columnCount - 1));
    },

    calcColumns: function (gridClass, columns, marginWidth) {

        //console.log('gridClass:', gridClass, 'columns:', columns, 'marginWidth:', marginWidth);

        var createColumns = '';

        for (var i = 1; i <= columns; i++) {
            // divide the number of columns into the increment number and look for a whole number
            var num = columns / i;
            var num2 = Math.round(columns / i);

            if (num === num2) {
                var string = `.col-1-${num}`;
            } else {
                string = '';
            }

            if (string !== '') {
                createColumns += `
                    .${gridClass} .col-${i}-${columns}, .${gridClass} ${string} {
                        width: ${this.getWidth(i, columns, marginWidth)}%
                    }`;
            } else {
                createColumns += `
                    .${gridClass} .col-${i}-${columns} {
                        width: ${this.getWidth(i, columns, marginWidth)}%
                    }`;
            }
        }
        return createColumns;
    },

    calcResponsiveColumns: function(columnClass, margin, col) {
        return `.${columnClass} {
                    width: ${this.getWidth(1, col, margin)}
                }`;
    }
};