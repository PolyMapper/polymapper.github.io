
L.CountrySelect = {};
L.CountrySelect = L.Control.extend({
	options: {
		position: 'topright',
		title: 'Data Selection',
		exclude: [],
		include: [],
		countries: ["RemainPercent_EU", "LeavePercent_EU", "YesPercent_SR", "NoPercent_SR"],
	},
	onAdd: function(map) {
		this.div = L.DomUtil.create('div','leaflet-countryselect-container');
		this.select = L.DomUtil.create('select','leaflet-countryselect',this.div);
		var content = '';
		
		if (this.options.title.length > 0 ){
			content += '<option>'+this.options.title+'</option>';
		}
		
		var countries = (Array.isArray(this.options.include) && this.options.include.length > 0) ? this.options.include : this.options.countries;
		
		var countryKeys = Object.keys(countries).sort();
		
		for (i in countries){
			if (this.options.exclude.indexOf(countries[i]) == -1){
				content+='<option>'+countries[i]+'</option>';
			}
		}
		
		this.select.innerHTML = content;

		this.select.onmousedown = L.DomEvent.stopPropagation;
		
		return this.div;
	},
	on: function(type,handler){
		if (type == 'change'){
			this.onChange = handler;
			L.DomEvent.addListener(this.select,'change',this._onChange,this);			
		} else if (type == 'click'){ //don't need this here probably, but for convenience?
			this.onClick = handler;
			L.DomEvent.addListener(this.select,'click',this.onClick,this);			
		} else {
			console.log('CountrySelect - cannot handle '+type+' events.')
		}
	},
	_onChange: function(e) {
		var selectedCountry = this.select.options[this.select.selectedIndex].value;
		console.log(selectedCountry);
		/*e.feature = this.options.countries[selectedCountry];
		this.onChange(e);*/
		this.onChange(selectedCountry);
	}
});

L.countrySelect = function(id,options){
	return new L.CountrySelect(id,options);
};