'use strict';
angular
  .module('PitchEvaluator')
  .controller('View1Ctrl', function($rootScope, $scope, permissionsService, $firebaseObject, $firebaseArray, $location, loggedinCheck, teamService, userService, db_url) {


    loggedinCheck.check();
    if (!permissionsService.isPermitted('Overview')) {
      if ($rootScope.role != 'Team') {
        $location.path('login');
      }
      else {
        
      }

    }


    var teamsForCSV = [];

    var sessListRef = new Firebase(db_url+"/sessionList");
    var temp = new $firebaseArray(sessListRef);
    temp.$loaded(function() {
      temp.forEach(function(session) {
        if (session.name==$rootScope.session) {
          $scope.teamList = $firebaseArray(new Firebase(session.ref+"/teams"));
          $scope.teamList.$loaded(function() {
            $scope.teamList.sort(function(a,b) {return a.rank-b.rank});

            // to create the arrayOfObjects you'll print to CSV
            for (var i = 0; i < $scope.teamList.length; i++) {
              var curTeam = $scope.teamList[i];
              var teamy = new Team(curTeam.name, curTeam.q1Val,
                curTeam.q2Val, curTeam.q3Val, curTeam.q4Val,
                curTeam.ovrAvg, curTeam.rank);
              teamsForCSV.push(teamy);
            }//end for loop

          })
        }
      });
    });

    //Function to store the team in the teamService
    $scope.saveTeam = function(teamName) {
      teamService.set(teamName);
      $location.path('view2');
    }

    $scope.setSelectedTab = function(tab) {
      $location.path(tab);
    }

    $scope.dragStart = function(e, ui) {
      ui.item.data('start', ui.item.index());
       console.log(ui.item.index());

    }// create a temporary attribute on the element with old index
    $scope.dragEnd = function(e, ui) {
      var start = ui.item.data('start'),
          end = ui.item.index();//get the new and old index

      if (start<end) {
        $scope.teamList[start].rank = end+1;
        for (let i=start+1; i<=end;i++) {
          $scope.teamList[i].rank-=1;
        }
      }
      else {
        $scope.teamList[start].rank = end+1;
        for (let i=end; i<start;i++) {
          $scope.teamList[i].rank+=1;
        }
      }
      for (let i=0; i<$scope.teamList.length;i++) {
        $scope.teamList.$save(i);
      }
      $scope.teamList.sort(function(a,b) {return a.rank-b.rank})
      // for (let i=0; i<$scope.teamList.length;i++) {
      //   console.log($scope.teamList[i].name, $scope.teamList[i].rank);
      // }
    }

    $('#sortable').sortable({
      start: $scope.dragStart,
      update: $scope.dragEnd
    });

    //sam's Download Team Data CSV

    class Team {
      constructor(ToP, PoN, Demo, CI, Business, TA, rank) {
        this.Team_or_Product = ToP;
          this.Problem_or_Need = PoN;
          this.Demo = Demo;
          this.Customer_Insight = CI;
          this.Business = Business;
          this.Team_Average = TA;
          this.Rank = rank
      }
  }

    function convertArrayOfObjectsToCSV(args) {
        var result, ctr, keys, columnDelimiter, lineDelimiter, data;

        data = args.data || null;
        if (data == null || !data.length) {
            return null;
        }

        columnDelimiter = args.columnDelimiter || ',';
        lineDelimiter = args.lineDelimiter || '\n';

        keys = Object.keys(data[0]);

        result = '';
        result += keys.join(columnDelimiter);
        result += lineDelimiter;

        data.forEach(function(item) {
            ctr = 0;
            keys.forEach(function(key) {
                if (ctr > 0) result += columnDelimiter;

                result += item[key];
                ctr++;
            });
            result += lineDelimiter;
        });

        return result;
    }
    $scope.downloadCSV = function(args) {
        var data, filename, link;

        var csv = convertArrayOfObjectsToCSV({
            data: teamsForCSV
        });
        if (csv == null)
            return;

        filename = args.filename || 'export.csv';

        if (!csv.match(/^data:text\/csv/i)) {
            csv = 'data:text/csv;charset=utf-8,' + csv;
        }
        data = encodeURI(csv);

        link = document.createElement('a');
        link.setAttribute('href', data);
        link.setAttribute('download', filename);

        document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    }

});
