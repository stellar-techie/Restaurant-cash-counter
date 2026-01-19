const toppingEmojis = {
    "Lettuce": "🥬",
    "Tomato": "🍅",
    "Onion": "🧅",
    "Onions": "🧅",
    "Pickles": "🥒",
    "Cheese": "🧀",
    "Extra Cheese": "🧀",
    "Mushrooms": "🍄",
    "Jalapeños": "🌶️",
    "Mayo": "🥄",
    "Ketchup": "🍅",
    "Mustard": "💛",
    "Chicken": "🍗",
    "Egg": "🥚",
    "Fish": "🐟",
    "Bell Peppers": "🫑",
    "Olives": "🫒",
    "Pineapple": "🍍",
    "Spinach": "🥬",
    "Chipotle": "🌶️",
    "Cucumber": "🥒",
    "Peppers": "🫑"
};

const menu = {
    burger: {
        name: "Burger",
        basePrice: 150,
        bread: {
            "White Bun": 0,
            "Whole Wheat Bun": 20,
            "Brioche Bun": 30,
            "Lettuce Wrap": 0
        },
        patty: {
            "Chicken": 50,
            "Egg": 30,
            "Fish": 60,
            "Veggie": 20
        },
        cookingStyle: {
            "Medium": 0,
            "Medium Well": 0,
            "Well Done": 0,
            "Rare": 0
        },
        toppings: {
            "Lettuce": 10,
            "Tomato": 10,
            "Onion": 10,
            "Pickles": 10,
            "Cheese": 30,
            "Mushrooms": 20,
            "Jalapeños": 15,
            "Mayo": 0,
            "Ketchup": 0,
            "Mustard": 0
        }
    },
    pizza: {
        name: "Pizza",
        basePrice: 250,
        bread: {
            "Thin Crust": 0,
            "Regular Crust": 0,
            "Thick Crust": 40,
            "Gluten-Free": 80
        },
        patty: {
            "Small (8\")": 0,
            "Medium (12\")": 120,
            "Large (16\")": 240,
            "Extra Large (18\")": 360
        },
        cookingStyle: {
            "Light": 0,
            "Regular": 0,
            "Well Done": 0,
            "Crispy": 0
        },
        toppings: {
            "Chicken": 60,
            "Egg": 40,
            "Fish": 70,
            "Mushrooms": 30,
            "Onions": 20,
            "Bell Peppers": 30,
            "Olives": 30,
            "Extra Cheese": 40,
            "Pineapple": 30,
            "Jalapeños": 20,
            "Spinach": 20
        }
    },
    sandwich: {
        name: "Sandwich",
        basePrice: 120,
        bread: {
            "White Bread": 0,
            "Whole Wheat": 15,
            "Sourdough": 30,
            "Rye": 25,
            "Wrap": 20
        },
        patty: {
            "Chicken": 40,
            "Egg": 25,
            "Fish": 50,
            "Veggie": 0
        },
        cookingStyle: {
            "Cold": 0,
            "Toasted": 15,
            "Grilled": 30,
            "Pressed": 25
        },
        toppings: {
            "Lettuce": 10,
            "Tomato": 10,
            "Onion": 10,
            "Pickles": 10,
            "Cheese": 30,
            "Mayo": 0,
            "Mustard": 0,
            "Chipotle": 10,
            "Cucumber": 10,
            "Olives": 20,
            "Peppers": 20
        }
    }
};

// Generate random order number
function generateRandomOrderNumber() {
    return Math.floor(Math.random() * 9000) + 1000; // Generates number between 1000 and 9999
}

// Order state object
let orderState = {
    orderId: generateRandomOrderNumber(),
    item: null,
    options: {
        bread: null,
        patty: null,
        cookingStyle: null
    },
    toppings: []
};

// DOM elements
const itemSelect = document.getElementById('itemSelect');
const customizationOptions = document.getElementById('customizationOptions');
const toppingsSection = document.getElementById('toppingsSection');
const toppingsContainer = document.getElementById('toppingsContainer');
const orderDetails = document.getElementById('orderDetails');
const totalPrice = document.getElementById('totalPrice');
const generateBillBtn = document.getElementById('generateBillBtn');
const resetOrderBtn = document.getElementById('resetOrderBtn');
const billDisplay = document.getElementById('billDisplay');

const itemEmojis = {
    "Burger": "🍔",
    "Pizza": "🍕",
    "Sandwich": "🥪"
};

const pattyEmojis = {
    "Chicken": "🍗",
    "Egg": "🥚",
    "Fish": "🐟",
    "Veggie": "🥬"
};

// Initialize: Populate item select dropdown
function initializeMenu() {
    Object.keys(menu).forEach(itemKey => {
        const option = document.createElement('option');
        option.value = itemKey;
        const itemName = menu[itemKey].name;
        const emoji = itemEmojis[itemName] || '';
        option.textContent = emoji ? `${emoji} ${itemName}` : itemName;
        itemSelect.appendChild(option);
    });
}

// Render customization options based on selected item
function renderCustomizationOptions() {
    const selectedItem = orderState.item;
    if (!selectedItem) {
        customizationOptions.innerHTML = '';
        toppingsSection.style.display = 'none';
        return;
    }

    const itemData = menu[selectedItem];
    customizationOptions.innerHTML = '';

    // Render Bread options
    const breadGroup = createOptionGroup('bread', 'Bread Type', itemData.bread);
    customizationOptions.appendChild(breadGroup);

    // Render Patty/Size options
    const pattyLabel = selectedItem === 'pizza' ? 'Size' : 'Patty Type';
    const pattyGroup = createOptionGroup('patty', pattyLabel, itemData.patty);
    customizationOptions.appendChild(pattyGroup);

    // Render Cooking Style options
    const styleLabel = selectedItem === 'pizza' ? 'Cooking Style' : 'Cooking Style';
    const styleGroup = createOptionGroup('cookingStyle', styleLabel, itemData.cookingStyle);
    customizationOptions.appendChild(styleGroup);

    // Show toppings section
    toppingsSection.style.display = 'block';
    renderToppings(itemData.toppings);
}

// Create an option group i.e. (radio buttons)
function createOptionGroup(optionType, label, options) {
    const group = document.createElement('div');
    group.className = 'option-group';

    const groupLabel = document.createElement('label');
    groupLabel.textContent = label;
    group.appendChild(groupLabel);

    const radioGroup = document.createElement('div');
    radioGroup.className = 'radio-group';

    Object.keys(options).forEach(optionName => {
        const radioOption = document.createElement('div');
        radioOption.className = 'radio-option';

        const radio = document.createElement('input');
        radio.type = 'radio';
        radio.name = optionType;
        radio.value = optionName;
        radio.id = `${optionType}-${optionName}`;
        
        // Checks if this option is already selected
        if (orderState.options[optionType] === optionName) {
            radio.checked = true;
        }

        radio.addEventListener('change', () => {
            orderState.options[optionType] = optionName;
            updateOrderSummary();
        });

        const radioLabel = document.createElement('label');
        radioLabel.htmlFor = `${optionType}-${optionName}`;
        
        // emoji for patty options
        if (optionType === 'patty') {
            const emoji = pattyEmojis[optionName] || '';
            if (emoji) {
                const emojiSpan = document.createElement('span');
                emojiSpan.className = 'topping-emoji';
                emojiSpan.textContent = emoji;
                radioLabel.appendChild(emojiSpan);
            }
        }
        
        const textSpan = document.createElement('span');
        textSpan.textContent = optionName;
        radioLabel.appendChild(textSpan);

        const priceTag = document.createElement('span');
        priceTag.className = 'price-tag';
        const price = options[optionName];
        priceTag.textContent = price > 0 ? `(+₹${price})` : '(included)';

        radioOption.appendChild(radio);
        radioOption.appendChild(radioLabel);
        radioLabel.appendChild(priceTag);
        radioGroup.appendChild(radioOption);
    });

    group.appendChild(radioGroup);
    return group;
}

// Render toppings
function renderToppings(toppingsData) {
    toppingsContainer.innerHTML = '';

    Object.keys(toppingsData).forEach(toppingName => {
        const checkboxOption = document.createElement('div');
        checkboxOption.className = 'checkbox-option';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.value = toppingName;
        checkbox.id = `topping-${toppingName}`;
        
        // Check if this topping is already selected
        if (orderState.toppings.includes(toppingName)) {
            checkbox.checked = true;
        }

        checkbox.addEventListener('change', () => {
            if (checkbox.checked) {
                if (!orderState.toppings.includes(toppingName)) {
                    orderState.toppings.push(toppingName);
                }
            } else {
                orderState.toppings = orderState.toppings.filter(t => t !== toppingName);
            }
            updateOrderSummary();
        });

        const checkboxLabel = document.createElement('label');
        checkboxLabel.htmlFor = `topping-${toppingName}`;
        
        // Add emoji if available
        const emoji = toppingEmojis[toppingName] || '';
        if (emoji) {
            const emojiSpan = document.createElement('span');
            emojiSpan.className = 'topping-emoji';
            emojiSpan.textContent = emoji;
            checkboxLabel.appendChild(emojiSpan);
        }
        
        const textSpan = document.createElement('span');
        textSpan.textContent = toppingName;
        checkboxLabel.appendChild(textSpan);

        const priceTag = document.createElement('span');
        priceTag.className = 'price-tag';
        const price = toppingsData[toppingName];
        priceTag.textContent = price > 0 ? `(+₹${price})` : '(free)';

        checkboxOption.appendChild(checkbox);
        checkboxOption.appendChild(checkboxLabel);
        checkboxLabel.appendChild(priceTag);
        toppingsContainer.appendChild(checkboxOption);
    });
}

function calculateTotal() {
    if (!orderState.item) {
        return 0;
    }

    const itemData = menu[orderState.item];
    let total = itemData.basePrice;

    if (orderState.options.bread && itemData.bread[orderState.options.bread] !== undefined) {
        total += itemData.bread[orderState.options.bread];
    }
    if (orderState.options.patty && itemData.patty[orderState.options.patty] !== undefined) {
        total += itemData.patty[orderState.options.patty];
    }
    if (orderState.options.cookingStyle && itemData.cookingStyle[orderState.options.cookingStyle] !== undefined) {
        total += itemData.cookingStyle[orderState.options.cookingStyle];
    }

    orderState.toppings.forEach(topping => {
        if (itemData.toppings[topping] !== undefined) {
            total += itemData.toppings[topping];
        }
    });

    return total;
}

function updateOrderSummary() {
    if (!orderState.item) {
        orderDetails.innerHTML = '<p>No item selected</p>';
        totalPrice.textContent = '0.00';
        generateBillBtn.disabled = true;
        return;
    }

    const itemData = menu[orderState.item];
    let detailsHTML = `<p><strong>Item:</strong> ${itemData.name}</p>`;

    const allOptionsSelected = orderState.options.bread && 
                              orderState.options.patty && 
                              orderState.options.cookingStyle;

    if (allOptionsSelected) {
        detailsHTML += `<p><strong>Bread:</strong> ${orderState.options.bread}</p>`;
        const pattyLabel = orderState.item === 'pizza' ? 'Size' : 'Patty';
        detailsHTML += `<p><strong>${pattyLabel}:</strong> ${orderState.options.patty}</p>`;
        detailsHTML += `<p><strong>Cooking Style:</strong> ${orderState.options.cookingStyle}</p>`;

        if (orderState.toppings.length > 0) {
            detailsHTML += `<p><strong>Toppings:</strong> ${orderState.toppings.join(', ')}</p>`;
        } else {
            detailsHTML += `<p><strong>Toppings:</strong> None</p>`;
        }

        generateBillBtn.disabled = false;
    } else {
        detailsHTML += '<p style="color: #999;">Please select all customization options</p>';
        generateBillBtn.disabled = true;
    }

    orderDetails.innerHTML = detailsHTML;
    totalPrice.textContent = calculateTotal();
}

function generateBill() {
    if (!orderState.item || !orderState.options.bread || !orderState.options.patty || !orderState.options.cookingStyle) {
        return;
    }

    const itemData = menu[orderState.item];
    const total = calculateTotal();
    const pattyLabel = orderState.item === 'pizza' ? 'Size' : 'Patty Type';

    let billHTML = `
        <div class="bill-content">
            <div class="bill-header">
                <h3>Restaurant Bill</h3>
                <div class="order-number">Order #${orderState.orderId}</div>
            </div>
            <div class="bill-item">
                <div class="bill-item-title">${itemData.name}</div>
                <div class="bill-option"><strong>Bread:</strong> ${orderState.options.bread}</div>
                <div class="bill-option"><strong>${pattyLabel}:</strong> ${orderState.options.patty}</div>
                <div class="bill-option"><strong>Cooking Style:</strong> ${orderState.options.cookingStyle}</div>
                ${orderState.toppings.length > 0 ? 
                    `<div class="bill-option"><strong>Toppings:</strong> ${orderState.toppings.join(', ')}</div>` : 
                    '<div class="bill-option"><strong>Toppings:</strong> None</div>'
                }
            </div>
            <div class="bill-total">
                Total: ₹${total}
            </div>
            <div class="bill-thankyou">
                <p>Thank you for placing an order!</p>
                <span class="bill-chef">👨‍🍳</span>
            </div>
        </div>
    `;

    billDisplay.innerHTML = billHTML;
}

function resetOrder() {
    orderState.item = null;
    orderState.options = {
        bread: null,
        patty: null,
        cookingStyle: null
    };
    orderState.toppings = [];
    orderState.orderId = generateRandomOrderNumber();

    itemSelect.value = '';
    customizationOptions.innerHTML = '';
    toppingsSection.style.display = 'none';
    updateOrderSummary();
    billDisplay.innerHTML = '<p class="no-bill">No bill generated yet</p>';
}

itemSelect.addEventListener('change', (e) => {
    orderState.item = e.target.value || null;
    orderState.options = {
        bread: null,
        patty: null,
        cookingStyle: null
    };
    orderState.toppings = [];
    renderCustomizationOptions();
    updateOrderSummary();
});

generateBillBtn.addEventListener('click', generateBill);
resetOrderBtn.addEventListener('click', resetOrder);

initializeMenu();
updateOrderSummary();

