const GRADES = {
    'A': 4.0,
    'B+': 3.5,
    'B': 3.0,
    'C+': 2.5,
    'C': 2.0,
    'D': 1.0,
    'F': 0.0
};

let rowCount = 0;

function createRow() {
    rowCount++;
    const row = document.createElement('div');
    row.className = 'row';
    row.innerHTML = `
        <div>
            <input type="checkbox" checked onchange="toggleRow(this)">
        </div>
        <div>
            <input type="text" placeholder="Course #${rowCount}" class="course-input" disabled>
        </div>
        <div>
            <select disabled>
                <option value="">--</option>
                ${Object.keys(GRADES).map(grade => 
                    `<option value="${grade}">${grade}</option>`
                ).join('')}
            </select>
        </div>
        <div>
            <input type="text" placeholder="Credits" class="credits-input" disabled>
        </div>
        <div>
            <button class="delete-btn" onclick="deleteRow(this)">×</button>
        </div>
    `;
    return row;
}

function addRow() {
    const container = document.getElementById('rows-container');
    const row = createRow();
    container.appendChild(row);
    const checkbox = row.querySelector('input[type="checkbox"]');
    toggleRow(checkbox);
}

function deleteRow(button) {
    const container = document.getElementById('rows-container');
    if (container.children.length > 1) {
        button.closest('.row').remove();
    }
}

function toggleRow(checkbox) {
    const row = checkbox.closest('.row');
    const inputs = row.querySelectorAll('input[type="text"], select');
    inputs.forEach(input => {
        input.disabled = !checkbox.checked;
    });
}

function calculateGPA() {
    let totalPoints = 0;
    let totalCredits = 0;
    let error = '';

    const rows = document.querySelectorAll('.row');
    rows.forEach(row => {
        const checkbox = row.querySelector('input[type="checkbox"]');
        if (checkbox.checked) {
            const grade = row.querySelector('select').value;
            const creditsInput = row.querySelector('.credits-input');
            const credits = parseFloat(creditsInput.value);

            // Only validate grade and credits, course name is optional
            if (grade && !isNaN(credits) && credits > 0) {
                totalPoints += GRADES[grade] * credits;
                totalCredits += credits;
            } else if (!grade && !isNaN(credits) && credits > 0) {
                error = 'Please select a grade for all courses with credits.';
            } else if (grade && (isNaN(credits) || credits <= 0)) {
                error = 'Please enter valid credits (greater than 0) for all courses with grades.';
            } else if ((isNaN(credits) && grade) || (credits <= 0 && grade)) {
                error = 'Please enter valid credits (greater than 0) for all courses with grades.';
            }
        }
    });

    const errorBanner = document.getElementById('error-banner');
    if (error) {
        errorBanner.textContent = error;
        errorBanner.style.display = 'block';
        document.getElementById('gpa-result').textContent = '';
    } else if (totalCredits === 0) {
        errorBanner.textContent = 'Please enter at least one valid course with grade and credits.';
        errorBanner.style.display = 'block';
        document.getElementById('gpa-result').textContent = '';
    } else {
        errorBanner.style.display = 'none';
        const gpa = (totalPoints / totalCredits).toFixed(2);
        document.getElementById('gpa-result').textContent = gpa;
    }
}

function resetForm() {
    const container = document.getElementById('rows-container');
    container.innerHTML = '';
    document.getElementById('gpa-result').textContent = '';
    document.getElementById('error-banner').style.display = 'none';
    rowCount = 0; // Reset the row counter
    addRow();
}

// Initialize with one row
window.onload = () => {
    resetForm();
};