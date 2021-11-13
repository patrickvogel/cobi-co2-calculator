class CobiCo2Calculator {
    constructor(cobi, ratioSlider, usageSlider, tourOutput, totalOutput) {
        this.cobi = cobi;
        this.ratioSlider = ratioSlider;
        this.usageSlider = usageSlider;
        this.tourOutput = tourOutput;
        this.totalOutput = totalOutput;
        this.tourDistance = 0;
        this.totalDistance = 0;

        var this_ = this;
        
        cobi.tourService.ridingDistance.subscribe(function(distanceInM, timestamp) {
            var distanceInKm = distanceInM/1000;
            this_.tourDistance = distanceInKm;
            this_.updateOutput();
          });
      
        cobi.motor.distance.subscribe(function(distanceInKm, timestamp) {            
            this_.totalDistance = distanceInKm;
            this_.updateOutput();
          });
        
        this.ratioSlider.oninput = function() {
            this_.updateOutput();
        } 

        this.usageSlider.oninput = function() {
            this_.updateOutput();
        }

        this.updateOutput();
    }

    updateOutput(){
        this.tourOutput.innerText = this.calculateCo2(this.tourDistance);
        this.totalOutput.innerText = this.calculateCo2(this.totalDistance);
    }

    calculateCo2(distanceInKm){
        // CO2 consumption (kg/km)
        // Source: https://www.quarks.de/umwelt/klimawandel/co2-rechner-fuer-auto-flugzeug-und-co/
        var car = 0.1390; // 5l/100km
        var publicTransport = 0.0637;
        var ebike = 0.004;

        var r = this.ratioSlider.value/100;
        var nonBikeConsumption = r*publicTransport + (1-r)*car;
        
        var u = usageSlider.value/100;
        var usageConsumption = u*nonBikeConsumption - (1-u)*ebike;
        
        var co2 = distanceInKm * usageConsumption;
        return co2.toFixed(2);
    }
}