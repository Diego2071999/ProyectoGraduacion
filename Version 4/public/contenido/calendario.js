const months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
        let currentMonth = new Date().getMonth();
        let currentYear = new Date().getFullYear();

        function updateCalendarHeader() {
            document.getElementById('currentMonthYear').textContent = `${months[currentMonth]} ${currentYear}`;
        }

       // Agregar evento de clic al botón "Nueva Orden"
        document.getElementById('nueva-orden').addEventListener('click', function() {
        // Redirigir a datos del cliente
            window.location.href = 'datos cliente.html';
        });

        function generateCalendar(month, year) {
            const firstDay = new Date(year, month).getDay();
            const daysInMonth = new Date(year, month + 1, 0).getDate();

            const calendarBody = document.getElementById('calendarBody');
            calendarBody.innerHTML = "";

            let date = 1;
            for (let i = 0; i < 6; i++) {
                let row = document.createElement("tr");
                for (let j = 0; j < 7; j++) {
                    if (i === 0 && j < firstDay) {
                        row.appendChild(document.createElement("td"));
                    } else if (date > daysInMonth) {
                        break;
                    } else {
                        let cell = document.createElement("td");
                        cell.textContent = date;
                        if (date === new Date().getDate() && month === new Date().getMonth() && year === new Date().getFullYear()) {
                            cell.classList.add("today"); // Aquí se asigna la clase
                        }
                        row.appendChild(cell);
                        date++;
                    }
                }
                calendarBody.appendChild(row);
            }
        }

        function previousMonth() {
            currentMonth--;
            if (currentMonth < 0) {
                currentMonth = 11;
                currentYear--;
            }
            updateCalendarHeader();
            generateCalendar(currentMonth, currentYear);
        }

        function nextMonth() {
            currentMonth++;
            if (currentMonth > 11) {
                currentMonth = 0;
                currentYear++;
            }
            updateCalendarHeader();
            generateCalendar(currentMonth, currentYear);
        }

        document.addEventListener('DOMContentLoaded', () => {
            updateCalendarHeader();
            generateCalendar(currentMonth, currentYear);
        });