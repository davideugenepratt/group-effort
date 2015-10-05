jQuery(document).ready( function() {
								 
	function get_services( event ) {
		var services = new Array();
		jQuery( event.target ).parents( '.formation_social_table' ).find('tr').not('.no-fields').each( function() {
			var service = [ jQuery(this).attr('class') , jQuery(this).find('input.caption').val() , jQuery(this).find('input.link').val() ];
			services.push( service );
		});
		jQuery( '.formation_social_table input.all_services' ).val( JSON.stringify( services ) );
	}
	
	jQuery(".formation_social_selector").find('option').each(function () {
		if (this.defaultSelected) {
			this.selected = true;
			return false;
		}
	});
	
	jQuery(document).on("change", ".formation_social_selector", function(event) {
		//alert( jQuery(this).parents('.formation_social_table').children('table').html() );
		var table = jQuery(this).parents('.formation_social_table').children('table');
		if ( table.hasClass('hidden') ) {
			table.removeClass('hidden');
		}
		table.children('tbody').append('<tr class="'+jQuery(this).val()+'"><td class="icon_cell"><a href="#" class="delete_service"><i class="fi-x"></i></a></td><td  class="icon_cell"><i class="service_icon fi-'+jQuery(this).val()+'"></i></td><td><input type="text" class="widefat caption"></td><td><input type="text" class="widefat link"></td></tr>');
		jQuery(this).find('option').each(function () {
			if (this.defaultSelected) {
				this.selected = true;
				return false;
			}
		});
		get_services( event );
	});
	
	jQuery(document).on("change", ".formation_social_table input", function(event) {
		get_services( event );
	});
	
	jQuery(document).on("click", ".formation_social_table .delete_service", function(event) {
		event.preventDefault();
		if ( jQuery( this ).parents( 'table' ).find( 'tr' ).length == 3 ) {
			jQuery( this ).parents( 'table' ).addClass( 'hidden' );
		}
		jQuery( this ).parents( 'tr' ).remove();
		get_services( event );
	});
	
});