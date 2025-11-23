// Щоб точно все спрацювало після завантаження DOM
window.addEventListener('DOMContentLoaded', () => {
    const arrayContainer = document.getElementById('arrayContainer');
    const algorithmSelect = document.getElementById('algorithm');
    const sizeInput = document.getElementById('size');
    const generateBtn = document.getElementById('generateBtn');
    const prevStepBtn = document.getElementById('prevStepBtn');
    const nextStepBtn = document.getElementById('nextStepBtn');
    const stepInfo = document.getElementById('stepInfo');

    let currentArray = [];
    let steps = [];          // масив станів
    let currentStepIndex = 0;

    // ------------------ Утиліти ------------------

    function generateRandomArray(size) {
        const arr = [];
        for (let i = 0; i < size; i++) {
            arr.push(Math.floor(Math.random() * 90) + 10); // 10–99
        }
        return arr;
    }

    function cloneArray(arr) {
        return arr.slice();
    }

    // Структура кроку:
    // {
    //   array: [...],
    //   i: index1,
    //   j: index2,
    //   swapped: true/false
    // }

    // ------------------ Алгоритми сортування ------------------

    function bubbleSortSteps(arr) {
        const a = cloneArray(arr);
        const localSteps = [];

        localSteps.push({ array: cloneArray(a), i: -1, j: -1, swapped: false });

        const n = a.length;
        for (let i = 0; i < n; i++) {
            for (let j = 0; j < n - i - 1; j++) {
                // Крок порівняння
                localSteps.push({
                    array: cloneArray(a),
                    i: j,
                    j: j + 1,
                    swapped: false
                });

                if (a[j] > a[j + 1]) {
                    const tmp = a[j];
                    a[j] = a[j + 1];
                    a[j + 1] = tmp;

                    // Крок після обміну
                    localSteps.push({
                        array: cloneArray(a),
                        i: j,
                        j: j + 1,
                        swapped: true
                    });
                }
            }
        }

        return localSteps;
    }

    function selectionSortSteps(arr) {
        const a = cloneArray(arr);
        const localSteps = [];

        localSteps.push({ array: cloneArray(a), i: -1, j: -1, swapped: false });

        const n = a.length;
        for (let i = 0; i < n - 1; i++) {
            let minIndex = i;
            for (let j = i + 1; j < n; j++) {
                // Порівняння поточного елемента з мінімумом
                localSteps.push({
                    array: cloneArray(a),
                    i: minIndex,
                    j,
                    swapped: false
                });

                if (a[j] < a[minIndex]) {
                    minIndex = j;
                    // Показати оновлений мінімум
                    localSteps.push({
                        array: cloneArray(a),
                        i: minIndex,
                        j,
                        swapped: false
                    });
                }
            }

            if (minIndex !== i) {
                const tmp = a[i];
                a[i] = a[minIndex];
                a[minIndex] = tmp;

                // Крок після обміну
                localSteps.push({
                    array: cloneArray(a),
                    i,
                    j: minIndex,
                    swapped: true
                });
            }
        }

        return localSteps;
    }

    function insertionSortSteps(arr) {
        const a = cloneArray(arr);
        const localSteps = [];

        localSteps.push({ array: cloneArray(a), i: -1, j: -1, swapped: false });

        const n = a.length;
        for (let i = 1; i < n; i++) {
            let key = a[i];
            let j = i - 1;

            // Показуємо ключ
            localSteps.push({
                array: cloneArray(a),
                i,
                j,
                swapped: false
            });

            while (j >= 0 && a[j] > key) {
                // Показуємо порівняння
                localSteps.push({
                    array: cloneArray(a),
                    i: j,
                    j: j + 1,
                    swapped: false
                });

                a[j + 1] = a[j];
                j--;

                // Після зсуву
                localSteps.push({
                    array: cloneArray(a),
                    i: j,
                    j: j + 1,
                    swapped: true
                });
            }
            a[j + 1] = key;

            // Вставка ключа
            localSteps.push({
                array: cloneArray(a),
                i: j + 1,
                j: i,
                swapped: true
            });
        }

        return localSteps;
    }

    // ------------------ Візуалізація ------------------

    function renderStep(step) {
        arrayContainer.innerHTML = '';
        const maxValue = Math.max(...step.array);

        step.array.forEach((value, index) => {
            const bar = document.createElement('div');
            bar.classList.add('bar');

            const heightPercent = (value / maxValue) * 90; // 90% висоти контейнера
            bar.style.height = `${heightPercent}%`;

            if (index === step.i || index === step.j) {
                bar.classList.add('compare');
            }
            if (step.swapped && (index === step.i || index === step.j)) {
                bar.classList.add('swapped');
            }

            const label = document.createElement('span');
            label.textContent = value;
            bar.appendChild(label);

            arrayContainer.appendChild(bar);
        });

        stepInfo.textContent = `Крок: ${currentStepIndex + 1} / ${steps.length}`;
        updateButtonsState();
    }

    function updateButtonsState() {
        prevStepBtn.disabled = currentStepIndex <= 0;
        nextStepBtn.disabled = currentStepIndex >= steps.length - 1 || steps.length === 0;
    }

    function recalcSteps() {
        const algorithm = algorithmSelect.value;

        if (!currentArray.length) return;

        if (algorithm === 'bubble') {
            steps = bubbleSortSteps(currentArray);
        } else if (algorithm === 'selection') {
            steps = selectionSortSteps(currentArray);
        } else if (algorithm === 'insertion') {
            steps = insertionSortSteps(currentArray);
        }

        currentStepIndex = 0;
        if (steps.length > 0) {
            renderStep(steps[0]);
        } else {
            arrayContainer.innerHTML = '';
            stepInfo.textContent = 'Крок: 0 / 0';
        }
    }

    // ------------------ Обробники подій ------------------

    generateBtn.addEventListener('click', () => {
        let size = parseInt(sizeInput.value, 10);
        if (isNaN(size) || size < 5) size = 5;
        if (size > 50) size = 50;

        currentArray = generateRandomArray(size);
        recalcSteps();
    });

    nextStepBtn.addEventListener('click', () => {
        if (currentStepIndex < steps.length - 1) {
            currentStepIndex++;
            renderStep(steps[currentStepIndex]);
        }
    });

    prevStepBtn.addEventListener('click', () => {
        if (currentStepIndex > 0) {
            currentStepIndex--;
            renderStep(steps[currentStepIndex]);
        }
    });

    algorithmSelect.addEventListener('change', () => {
        recalcSteps();
    });

    // ------------------ Стартовий стан ------------------

    let initialSize = parseInt(sizeInput.value, 10);
    if (isNaN(initialSize) || initialSize < 5) initialSize = 10;
    currentArray = generateRandomArray(initialSize);
    recalcSteps();
});
