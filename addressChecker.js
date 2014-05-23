(function($){
    $.widget( "ui.addressChecker", {
        options: {
            street: null,
            number: null,
            postcode: null,
            locality: null,
            map: null,
            infos: null,
            latitude: null,
            longitude: null,
            address: {
                street: null,
                number: null,
                postcode: null,
                locality: null,
                lat: null,
                lng: null
            }
        },
        _getAddress: function(){
            var number = $(this.options.number).val();
            var street = $(this.options.street).val();
            var postcode = $(this.options.postcode).val();
            var locality = $(this.options.locality).val();

            var address = number + " " + street + ", " + postcode + " " + locality;

            return address.replace(/[ ,\']/gi, "+");
        },
        _showInfos: function(googleresponse){
            var self = this;
            $a = $("<a>").html("ok").attr("href", "#").addClass("btn btn-default btn-xs pull-right").on("click", function(){
                self._sanitize();
                return false;
            });
            this.options.infos.html($a).append(" - " + googleresponse.formatted_address);
        },
        _checkInfos: function(){
            var self = this;
            $a = $("<a>").html("check").attr("href", "#").addClass("btn btn-default btn-xs pull-right").on("click", function(){
                self._localizeAddress();
                return false;
            });
            this.options.infos.html($a);
        },
        _cantFind: function(){
            this.options.map.html("");
            this.options.infos.html("Can't Find ! ");
        },
        _extractAdressFromResult: function(result){
            this.options.address.number= result.address_components[0].long_name;
            address = {};

            $.each(result.address_components, function(id, value){
                address[value.types[0]] = value.long_name;
            });
            this.options.address.number = address.street_number;
            if(address.street_address != null)
                this.options.address.street = address.street_address;
            else
                this.options.address.street = address.route;
            this.options.address.postcode = address.postal_code;
            if(address.sublocality != null)
                this.options.address.locality = address.sublocality;
            else
                this.options.address.locality = address.locality;
        },
        _sanitize: function(){
            if($(this.options.number).val() !== this.options.address.number)
                $(this.options.number).css({border: "solid 2px"});
            if($(this.options.street).val() !== this.options.address.street)
                $(this.options.street).css({border: "solid 2px"});
            if($(this.options.postcode).val() !== this.options.address.postcode)
                $(this.options.postcode).css({border: "solid 2px"});
            if($(this.options.locality).val() !== this.options.address.locality)
                $(this.options.locality).css({border: "solid 2px"});

            if(this.options.address.number != null)
                $(this.options.number).val(this.options.address.number);
            if(this.options.address.street != null)
                $(this.options.street).val(this.options.address.street);
            if(this.options.address.postcode != null)
                $(this.options.postcode).val(this.options.address.postcode);
            if(this.options.address.locality != null)
                $(this.options.locality).val(this.options.address.locality);
            $(this.options.latitude).val(this.options.address.lat);
            $(this.options.longitude).val(this.options.address.lng);
        },
        _localizeAddress: function(){
            var self = this;
            jQuery.ajax({
                url: "https://maps.googleapis.com/maps/api/geocode/json?address=" + self._getAddress() + '+belgium&sensor=false',
                type: "GET",
                success: function(data) {
                    if(data.status != "OK")
                        return self._cantFind();

                    self._extractAdressFromResult(data.results[0]);
                    self.options.address.lat = data.results[0].geometry.location.lat;
                    self.options.address.lng = data.results[0].geometry.location.lng;

                    self._initMap();
                    self._showInfos(data.results[0]);
                }
            });
        },
        _initMap: function(){
            this.position = new google.maps.LatLng(this.options.address.lat, this.options.address.lng);
            var mapOptions = {
                center: this.position,
                zoom: 15
            };
            this.map = new google.maps.Map(this.options.map[0], mapOptions);
            this.gmarker = new google.maps.Marker({
                position: this.position,
                map:this.map,
                draggable: this.options.draggableMarker
            });
        },
        _create: function(){
            var self = this;
            if(
                self.options.longitude == null ||
                self.options.latitude == null ||
                self.options.longitude.val() == "" ||
                self.options.latitude.val() == null
                ){
                self._localizeAddress();
            }else{
                self.options.address.lat = self.options.latitude.val();
                self.options.address.lng = self.options.longitude.val();
                self._initMap();
            }

            $(self.options.number)
                .add(self.options.street)
                .add(self.options.postcode)
                .add(self.options.locality)
                .on("change", function(){
                    self._checkInfos();
                });
        }
    });
})(jQuery);
