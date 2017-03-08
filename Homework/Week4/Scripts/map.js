// mao.js

function ShowMap()
{

//basic map configuration with custom fills, Mercator projection
var map = new Datamap({
  scope: 'world',
  element: document.getElementById('container1'),
  projection: 'mercator',
  height: 500,

  fills: {
	 defaultFill: '#f0af0a',
	 lt50: 'rgba(0,244,244,0.9)',
	 conflict: 'red'
  },
  
  data: {
	BFA: {fillKey: 'conflict', name: 'Burkina Faso', popn: 5633000, agrgdp: 35.44188862, year: 1970, infmort: 141.3999939}, 
	BWA: {fillKey: 'conflict', name: 'Botswana', popn: 623500, agrgdp: 33.05509182, year: 1970, infmort: 94.80000305}, 
	CMR: {fillKey: 'conflict', name: 'Cameroon', popn: 6506000, agrgdp: 31.36392206, year: 1970, infmort: 125.8000031}, 
	ETH: {fillKey: 'conflict', name: 'Etheopia', popn: 28937000, agrgdp: 1.79769313486232e+308, year: 1970, infmort: 157.8000031}, 
	GHA: {fillKey: 'conflict', name: 'Ghana', popn: 8614000, agrgdp: 46.51883327, year: 1970, infmort: 110.5999985}, 
	GMB: {fillKey: 'conflict', name: 'Gambia', popn: 464000, agrgdp: 32.5443787, year: 1970, infmort: 184.6000061}, 
	KEN: {fillKey: 'conflict', name: 'Kenya', popn: 11498000, agrgdp: 33.29286623, year: 1970, infmort: 102}, 
	LBR: {fillKey: 'conflict', name: 'Liberia', popn: 1385000, agrgdp: 24.10147992, year: 1970, infmort: 177.8000031}, 
	LSO: {fillKey: 'conflict', name: 'Lesoto', popn: 1064000, agrgdp: 34.86430063, year: 1970, infmort: 134}, 
	MDG: {fillKey: 'conflict', name: 'Madagascar', popn: 6745000, agrgdp: 24.4302794, year: 1970, infmort: 181.1999969}, 
	MUS: {fillKey: 'conflict', name: 'Mauritus', popn: 829000, agrgdp: 16.2077413, year: 1970, infmort: 59.79999924}, 
	MWI: {fillKey: 'conflict', name: 'Malawi', popn: 4518000, agrgdp: 43.97163121, year: 1970, infmort: 193.3999939}, 
	NGA: {fillKey: 'conflict', name: 'Nigeria', popn: 53215000, agrgdp: 41.2847914, year: 1970, infmort: 139.3999939}, 
	SDN: {fillKey: 'conflict', name: 'Sudan', popn: 13859000, agrgdp: 42.93389775, year: 1970, infmort: 118}, 
	SWZ: {fillKey: 'conflict', name: 'Swaziland', popn: 419000, agrgdp: 33.19559229, year: 1970, infmort: 138.6000061}, 
	ZMB: {fillKey: 'conflict', name: 'Zambia', popn: 4189000, agrgdp: 10.65195273, year: 1970, infmort: 106}, 
	ZWE: {fillKey: 'conflict', name: 'Zimbabwe', popn: 5249000, agrgdp: 15.13353116, year: 1970, infmort: 96.19999695} 
	},
	geographyConfig: {
		popupTemplate: function(geo, data) {
			
			if (data){
				console.log( geo.properties.name + data.popn)
				return ["<div class='hoverinfo'>Population in " + data.name + "</br>" + data.popn + " Humans" + "</div>"].join('');
			}else{
				console.log( geo.properties.name)
				return ["<div class='hoverinfo'>" + geo.properties.name + "</div>"].join('');
			}
      }
	}
  });
}
