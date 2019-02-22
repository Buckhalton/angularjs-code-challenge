const app = angular.module("Candidate.App", []);
app.component("itmRoot", {
    controller: class {
        constructor() {
            this.candidates = [{ name: "Puppies", votes: 10 }, { name: "Kittens", votes: 12 }, { name: "Gerbils", votes: 7 }];
            this.sortCandidates();
        }

        // This method sorts the candidates in order by votes, descending.
        sortCandidates() {
            console.log('Before sort', this.candidates)
            this.candidates.sort((a, b) => b.votes - a.votes);
            console.log('After sort', this.candidates);
        } // end sortCandidates

        onVote(candidate) {
            console.log(`Vote for ${candidate.name}, votes: ${candidate.votes}`);
            // adding 1 vote to the candidate that was clicked on
            candidate.votes++;
            this.sortCandidates();
        } // end onVote

        // This method checks to see if a candidate has already been added.
        // I moved this outside of onAddCandidate, as it improves readability.
        candidateCheck(candidate) {
            //Looping through the candidates array
            for(let i in this.candidates) {
                 //if the candidate exists, return true
                if(this.candidates[i].name.toLowerCase() === candidate.name.toLowerCase()) {
                    return true;
                } 
            } // end for in loop
            //otherwise return false
            return false;
        } // end candidateCheck

        onAddCandidate(candidate) {
            // If the field is empty, alert the user
            if(candidate.name === undefined || candidate.name === "") {
                alert("Please enter a name for the candidate!");
            // If the candidate already exists, alert the user
            } else if(this.candidateCheck(candidate)) {
                alert('That candidate already exists!');
            // Else, if the field isn't empty, and the candidate doesn't exist, push the new candidate into the array.
            } else {
                console.log(`Added candidate ${candidate.name}`);
                // using the spread syntax to add a new key-value pair for votes, and pushing the new candidate into the array.
                this.candidates.push(candidate);
                console.log(this.candidates);
            }
        }// End onAddCandidate

        onRemoveCandidate(candidate) {
            console.log(`Removed candidate ${candidate.name}`);
            // looping through the candidates array
            for(let i in this.candidates) {
                // if the candidate that was clicked on matches a candidate in the array
                if(candidate === this.candidates[i]) {
                    // remove that specific candidate from the array
                    this.candidates.splice(i, 1);
                }
            }
            console.log(this.candidates);
        } // end onRemoveCandidate
    },
    template: `
        <h1>Which candidate brings the most joy?</h1>
             
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
            };
        }

        submitCandidate(candidate) {
            this.onAdd({ $candidate: candidate });
        }

        removeCandidate(candidate) {
            this.onRemove({ $candidate: candidate });
        }
    },
    template: `
        <h2>Manage Candidates</h2>

        <h3>Add New Candidate</h3>
        <form ng-submit="$ctrl.submitCandidate($ctrl.newCandidate)" novalidate>

            <label>Candidate Name</label>
            <input type="text" ng-model="$ctrl.newCandidate.name" required>

            <button type="submit">Add</button>
        </form>

        <h3>Remove Candidate</h3>
        <ul>
            <li ng-repeat="candidate in $ctrl.candidates">
                <span ng-bind="candidate.name"></span>
                <button type="button" ng-click="$ctrl.removeCandidate(candidate)">X</button>
            </li>
        </ul>

    `
});

app.component("itmVote", {
    bindings: {
        candidates: "<",
        onVote: "&"
    },
    controller: class {},
    template: `
        <h2>Cast your vote!</h2>

        <button type="button"
            ng-repeat="candidate in $ctrl.candidates"
            ng-click="$ctrl.onVote({ $candidate: candidate })">
            <span ng-bind="candidate.name"></span>
        </button>
    `
});

app.component("itmResults", {
    bindings: {
        candidates: "<"
    },
    controller: class {},
    template: `
        <h2>Live Results</h2>
        <ul>
            <li ng-repeat="candidate in $ctrl.candidates">
                <span ng-bind="candidate.name"></span>
                <strong ng-bind="candidate.votes"></strong>
            </li>
        </ul>
    `
});
