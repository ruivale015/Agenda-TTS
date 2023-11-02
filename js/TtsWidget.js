/* 
 * Widgets 
 */

jQuery.widget('custom.ttsautocomplete', jQuery.ui.autocomplete, {
	
    _create: function() {
      this._super();
      this.widget().menu( "option", "items", "> :not(.ui-widget-header)" );
    },
    _renderMenu: function(ul, items) {
        var self = this, thead;
    
        if (this.options.showHeader) {
            table=jQuery('<div class="ui-widget-header col-sm-2" style="width:100%"></div>');
            // Column headers
            jQuery.each(this.options.columns, function(index, item) {
                table.append('<span style="padding:0 4px;float:left;width:' + item.minWidth + ';">' + item.name + '</span>');
            });
			table.append('<div style="clear: both;"></div>');
            ul.append(table);
        }
        // List items
        jQuery.each(items, function(index, item) {
            self._renderItem(ul, item);
        });
    },
    _renderItem: function(ul, item) {
		var t = '',
			result = '';
		
		jQuery.each(this.options.columns, function(index, column) {
			t += '<span style="padding:0 4px;float:left;width:' + column.minWidth + ';"> ' + item[column.valueField ? column.valueField : index] + ' </span>'
		});
	
		result = $('<li></li>')
			.data('ui-autocomplete-item', item)
			.append('<a class="mcacAnchor">' + t + '<div style="clear: both;"></div></a>')
			.appendTo(ul);
		return result;
    }
});
