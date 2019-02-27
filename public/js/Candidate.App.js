const app = angular.module("Candidate.App", []);
// Declaring the total amount of votes globally
let totalVotes = 0;

app.component("itmRoot", {
    controller: class {
        constructor() {
            this.candidates = [{ name: "Puppies", votes: 0, percentage: 0.00 }, { name: "Kittens", votes: 0, percentage: 0.00 }, { name: "Gerbils", votes: 0, percentage: 0.00 }];
            this.calculatePercentage();
        }

        // This method sorts the candidates in order by votes, descending.
        sortCandidates() {
            this.candidates.sort((a, b) => b.votes - a.votes);
        } // end sortCandidates

        calculatePercentage() {
            // For each candidate in the array, calculate the percentage
            this.candidates.forEach((candidate) => {
                if (candidate.votes != 0.00) {
                    // Dividing each candidate's votes by the total amount of votes, and then multiplying by 100 for the percentage. 
                    candidate.percentage = (candidate.votes / totalVotes * 100).toFixed(2) + '%';
                } else {
                    candidate.percentage = "0.00%";
                }
            }) // end forEach
        } // end calculatePercentage

        onVote(candidate) {
            // Adding 1 vote to the candidate that was clicked on
            candidate.votes++;
            // Sorting the candidates after adding the new vote
            this.sortCandidates();
            // Increasing the total amount of votes
            totalVotes++;
            // Calculating the new percentages
            this.calculatePercentage();
        } // end onVote

        // This method checks to see if a candidate has already been added.
        // I moved this outside of onAddCandidate, as it improves readability.
        candidateCheck(candidate) {
            //Looping through the candidates array
            for (let i in this.candidates) {
                //if the candidate exists, return true
                if (this.candidates[i].name.toLowerCase() === candidate.name.toLowerCase()) {
                    return true;
                }
            } // end for in loop
            //Otherwise return false
            return false;
        } // end candidateCheck

        onAddCandidate(candidate) {
            // If the field is empty, alert the user
            if (candidate.name === undefined || candidate.name === "") {
                alert("Please enter a name for the candidate!");
                // If the candidate already exists, alert the user
            } else if (this.candidateCheck(candidate)) {
                alert('That candidate already exists!');
                // Else, if the field isn't empty, and the candidate doesn't exist, push the new candidate into the array.
            } else {
                // Using the spread syntax to add a new key-value pair for votes, and pushing the new candidate into the array.
                this.candidates.push({ ...candidate });
                this.calculatePercentage();
            }
        }// End onAddCandidate

        onRemoveCandidate(candidate) {
            // Looping through the candidates array
            for (let i in this.candidates) {
                // If the candidate that was clicked on matches a candidate in the array
                if (candidate === this.candidates[i]) {
                    // Remove that specific candidate from the array
                    this.candidates.splice(i, 1);
                    // Subtract that candidates votes from the total amount of votes
                    totalVotes = totalVotes - candidate.votes;
                    // Calculate the new percentage
                    this.calculatePercentage();
                }
            }
        } // end onRemoveCandidate
    },
    template: `
        <h1 class="jumbotron jumbotron-fluid">Which candidate brings the most joy?</h1>
             
        <itm-results 
            candidates="$ctrl.candidates">
        </itm-results>

        <itm-vote 
            candidates="$ctrl.candidates"
            on-vote="$ctrl.onVote($candidate)">
        </itm-vote>

        <itm-management 
            candidates="$ctrl.candidates"
            on-add="$ctrl.onAddCandidate($candidate)"
            on-remove="$ctrl.onRemoveCandidate($candidate)">
        </itm-management>
    `
});

app.component("itmManagement", {
    bindings: {
        candidates: "<",
        onAdd: "&",
        onRemove: "&"
    },
    controller: class {
        constructor() {
            this.newCandidate = {
                name: "",
                votes: 0,
                percentage: 0.00,
            };
        }

        submitCandidate(candidate) {
            this.onAdd({ $candidate: candidate });
            // Clearing the input after submitting the new candidate.
            this.newCandidate = {
                ...this.newCandidate,
                name: "",
            };
        } // end submitCandidate

        removeCandidate(candidate) {
            this.onRemove({ $candidate: candidate });
        } // end removeCandidate
    },
    template: `
        <div class="small-container">
            <h2 class="header">Manage Candidates</h2>

            <h3>Add New Candidate</h3>

            <form class="form-group" ng-submit="$ctrl.submitCandidate($ctrl.newCandidate)" novalidate>

                <input placeholder="Candidate Name" type="text" ng-model="$ctrl.newCandidate.name" required>

                <button type="submit" class="btn btn-outline-primary btn-sm">Add Candidate</button>
            </form>

            <h3>Remove Candidate</h3>
            <ul class="list-group">
                <li class="list-group-item candidate-remove" ng-repeat="candidate in $ctrl.candidates">
                    <span ng-bind="candidate.name"></span>
                    <button class="btn btn-outline-danger" type="button" ng-click="$ctrl.removeCandidate(candidate)">X</button>
                </li>
            </ul>
        </div>

    `
});

app.component("itmVote", {
    bindings: {
        candidates: "<",
        onVote: "&"
    },
    controller: class { },
    template: `
        <div class="small-container">
            <h2>Cast your vote!</h2>

            <button type="button"
                class="btn btn-outline-dark" 
                ng-repeat="candidate in $ctrl.candidates"
                ng-click="$ctrl.onVote({ $candidate: candidate })">
                <span ng-bind="candidate.name"></span>
            </button>
        <div>
    `
});

app.component("itmResults", {
    bindings: {
        candidates: "<",
    },
    controller: class {},
    template: `
        <div class="small-container">
            <h2>Live Results</h2>
            <ul class="list-group">
                <li class="list-group-item vote-results" ng-repeat="candidate in $ctrl.candidates">
                    <span class="candidate-name" ng-bind="candidate.name"></span>
                    <strong ng-bind="candidate.votes"></strong>
                    <div class="percentageContainer">
                        <div class="votePercentage" ng-style="{'width':candidate.percentage}">
                            <strong class="percentage" ng-bind="candidate.percentage"></strong>
                        </div>
                    </div>
                </li>
            </ul>
        <div>
    `
});
