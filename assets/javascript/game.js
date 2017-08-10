	$(document).ready(function() {

	var characterSelected;
	var enemySelected;
	var enemyDefeated;
	var enemiesAvailable;
	var powerUp = 6;
	var gameOn = true;
	var characterArray = [
		{
			name: "Darth Maul",
			picture: "assets/images/maul.jpg",
			hp: 120,
			ap: 2,
			cap: 10
		},
		{
			name: "Luke Skywalker",
			picture: "assets/images/luke.jpg",
			hp: 100,
			ap: 4,
			cap: 8
		},
		{
			name: "Darth Vader",
			picture: "assets/images/vader.jpg",
			hp: 150,
			ap: 4,
			cap: 20
		},
		{
			name: "Yoda",
			picture: "assets/images/yoda.jpg",
			hp: 180,
			ap: 2,
			cap: 20
		}
	]


	// Create initial list of available characters.
	createCharacterArray(characterArray);
	addLiClickListeners();
	addAttClickListeners();
	
	function createCharacterArray(characterArray) {
		
		
		for (i = 0; i < characterArray.length; i++) {
			
			var character = $("<li>");
			character.addClass("ui-widget-content");
			character.addClass("available-characters");
			
			var characterName = $("<div>");
			characterName.addClass("characterName");
			characterName.text(characterArray[i].name);

			var characterPicture = $("<img>");
			characterPicture.addClass("characterPicture");
			characterPicture.attr("src", characterArray[i].picture);
			
			var characterPower = $("<div>");
			characterPower.addClass("characterPower");
			characterPower.text(characterArray[i].hp);

			character.append(characterName, characterPicture, characterPower);

			character.attr("data-character", i);
			character.attr("data-attackPower", characterArray[i].ap);
			character.attr("data-counterAttackPower", characterArray[i].cap);
			character.attr("data-isCharacter", "false");
			character.attr("data-isEnemy", "false");

			character.appendTo(".characterArray");

		};
	};

	// Handle any clicks on a character.
	function addLiClickListeners() {

		$("li").on("click", function() {

			if (characterSelected && enemySelected) {
				return;

			// Pick enemy after character selection.
			} else if (characterSelected && ($(this).attr("data-isCharacter") == "false")) {

				var selectedEnemy = $(this);

				selectedEnemy.attr("data-isEnemy", "true");
				selectedEnemy.prependTo($("#selected-enemy"));
				$(this).css("background-color", "red");

				// Track enemy selection.
				enemySelected = true;

				// Remove this class so that enemies don't appear in character list on reset.
				$(".characterArray").removeClass($("#available-characters"));

				// Rename enemy class so that you can iterate through enemies later.
				$("ol").addClass("enemyList").removeClass("characterArray");


			// Choose character.
			} else {

				var selectedCharacter = $(this);

				selectedCharacter.attr("data-isCharacter", "true");
				
				selectedCharacter.appendTo($("#character-placeholder"));
				$(this).css("background-color", "green");

				// Remove this class to keep track of available characters.
				selectedCharacter.removeClass("available-characters");
				
				characterSelected = true;

				// Remove this class so reset is clean.
				$(".characterArray").removeClass($("#available-characters"));

				// Create enemy list once character selected.
				// Called at start and reset of game.
				$("ol").addClass("enemyList").removeClass("characterArray");

				$(".enemyList").appendTo($("#available-enemies"));


			}
		});
	}
	
	function addAttClickListeners() {

		// Event fires on attack button clicks.
		$("#attack").on("click", function(event) {

			// Fighting can only continue when game is on.
			if (gameOn) {

				var selectedCharacter = $("#selected-character #character-placeholder .ui-widget-content").html();
				var selectedEnemy = $("#fight-section #selected-enemy .ui-widget-content .characterName").html();
				var selectedCharacterHealthPoints = $("#selected-character #character-placeholder .ui-widget-content .characterPower").html();
				var selectedCharacterAttackPower = $("#selected-character #character-placeholder .ui-widget-content").attr("data-attackPower");
				var selectedEnemyHealthPoints = $("#fight-section #selected-enemy .ui-widget-content .characterPower").html();
				var selectedEnemyCounterAttackPoints = $("#fight-section #selected-enemy .ui-widget-content").attr("data-counterAttackPower");

				selectedCharacterHealthPoints = parseInt(selectedCharacterHealthPoints);
				selectedCharacterAttackPower = parseInt(selectedCharacterAttackPower);
				selectedEnemyHealthPoints = parseInt(selectedEnemyHealthPoints);
				selectedEnemyCounterAttackPoints = parseInt(selectedEnemyCounterAttackPoints);

				// If character has more power than enemy attack, attack.
				if ((selectedCharacterHealthPoints - selectedEnemyCounterAttackPoints) > 0) {
					
					// Attack and assess damage.
					characterAttacks(selectedCharacterHealthPoints, selectedEnemyCounterAttackPoints, selectedCharacterAttackPower, selectedEnemy);
		 		
		 		// Your character has lost and game is over.
		 		} else {
		 			
		 			characterLost(selectedCharacterHealthPoints, selectedEnemyCounterAttackPoints);
		 			gameOn = false;
		 		}

		 		// If enemy has more Power points than character attack power, attack.
				if ((selectedEnemyHealthPoints - selectedCharacterAttackPower) > 0) {
					enemyAttacksBack(selectedEnemyHealthPoints, selectedCharacterAttackPower);
		 		
				// Enemy lost and you will pick new enemy.
		 		} else if ((selectedEnemyHealthPoints - selectedCharacterAttackPower) <= 0) {

		 			enemyLost(selectedEnemyHealthPoints, selectedCharacterAttackPower, selectedEnemy);
				} else {
				console.log("Attack button shouldn't work when game is over.");
				}
	    	}
	  	});
	}
	
	// Restarts game on restart click.
	$("#fight-section").on("click", ".restart", function() {
		$("ol").addClass("characterArray").removeClass("enemyList");
		$(".characterArray").appendTo($("#available-characters"));
		$(".characterArray").empty();
		createCharacterArray(characterArray);
		addLiClickListeners();
		$("#available-enemies").empty();
		$("#character-placeholder").empty();
		$("#selected-enemy").empty();
		$("#fight-section.button.restart").empty();$("#attack-report").empty();
		$(".restart").remove();
		gameOn = true;
		characterSelected = false;
		enemySelected = false;
    });

    function characterAttacks(selectedCharacterHealthPoints, selectedEnemyCounterAttackPoints, selectedCharacterAttackPower, selectedEnemy) {
    	
    	// Adjusts character score.
    	selectedCharacterHealthPoints = selectedCharacterHealthPoints - selectedEnemyCounterAttackPoints;
		$("#selected-character #character-placeholder .ui-widget-content .characterPower").html(selectedCharacterHealthPoints);
		
		// Creates report.
		var characterReport = "You attacked " + selectedEnemy + " for " + selectedCharacterAttackPower + " damage.";
		var enemyReport = selectedEnemy + " attacked you back for " + selectedEnemyCounterAttackPoints + " damage.";
		$("#attack-report").text(characterReport);
		$("#losses-report").text(enemyReport);
    };

    // Manages character loss and end of game.
    function characterLost(selectedCharacterHealthPoints, selectedEnemyCounterAttackPoints) {
    	var gameLostMessage = "You've been defeated . . . GAME OVER!!!";
    	selectedCharacterHealthPoints = selectedCharacterHealthPoints - selectedEnemyCounterAttackPoints;
    	$("#selected-character #character-placeholder .ui-widget-content .characterPower").html(selectedCharacterHealthPoints);
    	$("#attack-report").text(gameLostMessage);
    	$("#losses-report").empty();
    	
    	// Adds restart button.
    	var restartBtn = $("<button>");
    	restartBtn.text("Restart");
    	restartBtn.addClass("restart");
    	restartBtn.addClass("button");
    	restartBtn.appendTo("#fight-section");
    };

    // Manages enemy counter attack.
    function enemyAttacksBack(selectedEnemyHealthPoints, selectedCharacterAttackPower) {
    	selectedEnemyHealthPoints = selectedEnemyHealthPoints - selectedCharacterAttackPower;
    	$("#fight-section #selected-enemy .ui-widget-content .characterPower").html(selectedEnemyHealthPoints);
    	var updatedCharacterAttackPower = selectedCharacterAttackPower + powerUp;
    	console.log("Power surge is working: " + updatedCharacterAttackPower);
    	$("#selected-character #character-placeholder .ui-widget-content").attr("data-attackPower", updatedCharacterAttackPower);
    	enemyDefeated = false;
    }

    // Manages enemy loss.
	function enemyLost(selectedEnemyHealthPoints, selectedCharacterAttackPower, selectedEnemy) {
		selectedEnemyHealthPoints = selectedEnemyHealthPoints - selectedCharacterAttackPower;
		$("#fight-section #selected-enemy .ui-widget-content .characterPower").html(selectedEnemyHealthPoints);

		var currentEnemy = $("#fight-section #selected-enemy .ui-widget-content");
		currentEnemy.css('visibility', 'hidden');

		enemyDefeated = true;
		enemySelected = false;

		$("#losses-report").empty();

		// Game is won when all enemies have been defeated.
		if ($(".enemyList").is(":empty")) {
			var enemyDefeatedMessage = "You Won!!! GAME OVER!!!";
			$("#attack-report").text(enemyDefeatedMessage);
			
			// Adds restart button.
			var restartBtn = $("<button>");
			restartBtn.text("Restart");
			restartBtn.addClass("restart");
			restartBtn.addClass("button");
			restartBtn.appendTo("#fight-section");
			gameOn = false;

		// Controls ability to select new enemy.
		} else {
			var enemyDefeatedMessage = "You have defeated " + selectedEnemy + ", " + "you can choose to fight another enemy.";
			$("#attack-report").text(enemyDefeatedMessage);

			// I tried unsuccessfully to disable the attack button if characters were not chosen.
			//A couple of times testing, two reset buttons showed on screen??? No idea what caused this?
		}
	
    };
});