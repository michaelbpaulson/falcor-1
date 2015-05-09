var Router = require('./router');
var titleService = require('./titleService');
var ratingService = require('./ratingService');
var genreListService = require('./genreListsService');
var Model = require('./../Falcor').Model;

function NetflixRouter(req, res) {
    this.req = req;
    this.res = res;
}

module.exports = NetflixRouter;

NetflixRouter.prototype = new Router([
    {
        route: 'genreLists[{ranges:ids}].name',
        get: function(pathSet) {

            // here is what a pathSet might look
            // ['genreLists', {from: 0, to: 1}, 'name']
            //
            // What we need to output
            // jsong: {
            //      genreLists: {
            //          0: { name: 'Recently Watched' },
            //          1: { name: 'New Releases' }
            //      }
            // }
            // genreListService.get(RANGE, cookie) => promise
            // {
            //    rows: [
            //        {
            //           index: 0,
            //            name: ‘Recently Watched’
            //        },
            //        ... more genres ...
            //    ]
            // }

            var range = pathSet.ids;
            return genreListService.
                get(range, this.req.cookie).
                then(function(payload) {
                    var out = {};
                    payload.rows.forEach(function(row) {
                        out[row.index] = {name: row.name};
                    });

                    return {
                        jsong: {
                            genreLists: out
                        }
                    };
                });
        }
    }
]);
