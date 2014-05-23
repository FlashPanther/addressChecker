#addressChecker#

##How to use##

###The html###

```HTML
<div id="map" style="..."></div>
<input type="text" id="street">
...
```

```JavaScript
$("#map").googleAddress({
    street: $("#street"),
    number: $("#number"),
    postcode: $("#postcode"),
    locality: $("#locality"),
    latitude: $("#latitude"),
    longitude: $("#longitude"),
    map: $("#map"),
    infos: $("#infos")
});
```
