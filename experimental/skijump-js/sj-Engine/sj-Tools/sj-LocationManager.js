
SJ.LocationManager = {};

SJ.LocationManager.changeLocation = (locationName, callback) => {
  SJ.loadVariablesFromFile('sj-'+locationName+'.json', () => {
    callback();
  });
}