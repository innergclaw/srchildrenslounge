(() => {
  const form = document.querySelector("[data-sr-event-registration-form]");
  if (!form) return;

  const schedules = {
    messy: {
      label: "Messy Thursdays",
      time: "5:00 PM-6:30 PM",
      paymentUrl: "https://square.link/u/FhIkEWa4",
      dates: [
        ["2026-07-09", "Thursday, July 9"],
        ["2026-07-16", "Thursday, July 16"],
        ["2026-07-23", "Thursday, July 23"],
        ["2026-07-30", "Thursday, July 30"],
        ["2026-08-06", "Thursday, August 6"],
        ["2026-08-13", "Thursday, August 13"],
        ["2026-08-20", "Thursday, August 20"],
      ],
    },
    toyStory: {
      label: "Toy Story Movie Day",
      time: "1:00 PM-3:00 PM",
      paymentUrl: "https://square.link/u/xNlq9GLo",
      dates: [["2026-08-16", "Sunday, August 16"]],
    },
    backToSchool: {
      label: "Free Back-to-School Community Day",
      time: "12:00 PM-4:00 PM",
      paymentUrl: "https://square.link/u/I6grnO8z",
      dates: [["2026-08-30", "Sunday, August 30"]],
    },
  };

  const eventSelect = form.querySelector("[name='event_name']");
  const dateSelect = form.querySelector("[name='preferred_date']");
  const requestedService = form.querySelector("[name='requested_service']");
  const preferredTime = form.querySelector("[name='preferred_time']");
  const paymentStep = form.querySelector("[data-sr-payment-step]");
  const paymentSummary = form.querySelector("[data-sr-payment-summary]");
  const paymentLink = form.querySelector("[data-sr-payment-link]");

  function currentSchedule() {
    return schedules[eventSelect.value] || null;
  }

  function updateDates() {
    const schedule = currentSchedule();
    dateSelect.innerHTML = '<option value="">Choose an available date</option>';
    paymentStep.hidden = true;

    if (!schedule) {
      dateSelect.disabled = true;
      requestedService.value = "";
      preferredTime.value = "";
      return;
    }

    schedule.dates.forEach(([value, label]) => {
      const option = document.createElement("option");
      option.value = value;
      option.textContent = label;
      dateSelect.appendChild(option);
    });

    dateSelect.disabled = false;
    requestedService.value = schedule.label;
    preferredTime.value = schedule.time;
  }

  eventSelect.addEventListener("change", updateDates);

  document.querySelectorAll("[data-sr-event-choice]").forEach((link) => {
    link.addEventListener("click", () => {
      const eventKey = link.dataset.srEventChoice;
      if (!schedules[eventKey]) return;
      eventSelect.value = eventKey;
      updateDates();
      window.setTimeout(() => eventSelect.focus(), 350);
    });
  });

  form.addEventListener("sr:submitted", (event) => {
    const schedule = currentSchedule();
    if (!schedule) return;

    const chosenDate = schedule.dates.find(([value]) => value === event.detail.payload.preferred_date);
    paymentSummary.textContent = `${schedule.label} - ${chosenDate ? chosenDate[1] : event.detail.payload.preferred_date} - ${schedule.time}`;
    paymentLink.href = schedule.paymentUrl;
    paymentStep.hidden = false;
    paymentStep.scrollIntoView({ behavior: "smooth", block: "center" });
  });

  updateDates();
})();
