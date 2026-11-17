"use strict";

const launchButton = document.querySelector("#launch-button");
const resetButton = document.querySelector("#reset-button");
const failCheckbox = document.querySelector("#fail-checkbox");
const secondsText = document.querySelector("#seconds");
const statusText = document.querySelector("#status");

function startCountdown(onDone) {
  let seconds = 5;
  secondsText.textContent = seconds;

  const timerId = setInterval(() => {
    seconds -= 1;
    secondsText.textContent = seconds;

    if (seconds <= 0) {
      clearInterval(timerId);
      if (typeof onDone === "function") {
        onDone();
      }
    }
  }, 650);
}

function checkSystems(onDone) {
  setTimeout(() => {
    if (typeof onDone === "function") {
      onDone("Проверка систем завершена.");
    }
  }, 800);
}

function requestPermission(shouldFail) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldFail) {
        reject(new Error("Разрешение на запуск не получено."));
      } else {
        resolve("Разрешение получено.");
      }
    }, 900);
  });
}

async function launchMission() {
  launchButton.disabled = true;
  resetButton.disabled = true;
  resetStages();

  try {
    setStage("countdown", "active");
    await new Promise((resolve) => startCountdown(resolve));
    setStage("countdown", "done");

    setStage("systems", "active");
    await new Promise((resolve) => checkSystems(resolve));
    setStage("systems", "done");

    setStage("permission", "active");
    const permissionMessage = await requestPermission(failCheckbox.checked);
    setStage("permission", "done");

    statusText.textContent = permissionMessage;
  } catch (error) {
    statusText.textContent = error.message;
  } finally {
    launchButton.disabled = false;
    resetButton.disabled = false;
  }
}