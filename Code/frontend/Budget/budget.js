
//dropdown
const dropDowns = document.querySelectorAll('.chevron-icon');
const dropDownMenus = document.querySelectorAll('.dropdown');
dropDowns.forEach((dropDown, index) => {
    dropDown.addEventListener('click', () => {
        // Toggle the form visibility
        dropDownMenus[index].style.display = dropDownMenus[index].style.display === "grid" ? "none" : "grid";
    });
});
//calender
const dateInput = document.getElementById('dateInput');
const currentDate = new Date();
const year = currentDate.getFullYear();
const monthIndex = currentDate.getMonth();
const monthNames = ["January", "February", "March", "April", "May", "June", 
                    "July", "August", "September", "October", "November", "December"];
const month = monthNames[monthIndex];
dateInput.value = `${year}-${String(monthIndex + 1).padStart(2, '0')}`;
document.querySelector('.date').textContent = `${month} ${year}`;

