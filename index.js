document.addEventListener('DOMContentLoaded', () => {
    let productContianer = document.querySelector('.product-container')
    let cart = document.querySelector('.cart')
    let cartListItems = document.querySelector('.cart-list-items')
    let cartTotalPrice = document.querySelector('.cart-total-price')
    let emptyCart = document.querySelector('.empty-cart')
    let cartItemCount = document.querySelector('.cart-count')
    let confirmOrder = document.querySelector('.order-confirm')
    let orderConfirmed = document.querySelector('.confirmation-modal')
    let orderConfirmedList = document.querySelector('.confirm-order-list')

    let mobileCartPage = document.querySelector('.mobile-cart-page')
    let mobileTopPage = document.querySelector('.top-page')

    mobileCartPage.addEventListener('click', () => {
        window.scrollTo(0,document.body.scrollHeight)
    })

    mobileTopPage.addEventListener('click', () => {
        window.scrollTo(0, 0)
    })


    let cartProducts = JSON.parse(localStorage.getItem('cartProducts')) || []

    async function getProducts(){
        let data = await fetch('./data.json')
        data = await data.json()
        return data
    }

    async function showProducts(){
        let products = await getProducts()

        productContianer.replaceChildren()
        products.forEach(product => {
            let cartProduct = cartProducts.find(prod => prod.id === product.id)
            let productDiv = document.createElement('div')
            productDiv.classList.add('product')

            let productViewDiv = document.createElement('div')
            productViewDiv.classList.add('product-view')

            let incDecDiv = document.createElement('div')
            incDecDiv.classList.add('inc-dec-count')
            if(cartProduct){
                productViewDiv.classList.add('product-selected')
            }

            incDecDiv.dataset.productId = product.id
            incDecDiv.innerHTML = `
            <button class="dec"><svg xmlns="http://www.w3.org/2000/svg" width="10" height="2" fill="none" viewBox="0 0 10 2"><path fill="#fff" d="M0 .375h10v1.25H0V.375Z"/></svg></button>
            <p class="count">${cartProduct?.quantity > 0 ? cartProduct?.quantity : `0${cartProduct?.quantity}`}</p>
            <button class="inc"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 10 10"><path fill="#fff" d="M10 4.375H5.625V0h-1.25v4.375H0v1.25h4.375V10h1.25V5.625H10v-1.25Z"/></svg></button>
            `

            let addToCartButton = document.createElement('button')
            addToCartButton.classList.add('add-to-cart')
            addToCartButton.innerHTML = `
            <img class='add-to-cart-image' src="./images/icon-add-to-cart.svg" alt="add-to-cart-icon">
            <p class='add'>Add to Cart</p>
            `

            addToCartButton.addEventListener('click', () => {
                productViewDiv.classList.add('product-selected')
                incDecDiv.querySelector('.count').textContent = `0${product.quantity}`
                cartProducts.push(product)
                updateCart()
                localStorage.setItem('cartProducts', JSON.stringify(cartProducts))

            })

            if(window.matchMedia("(width < 492px)").matches){

                productViewDiv.innerHTML = `
                <img src="${product.image.mobile}" alt="${product.name} image">
                `
            }else{
                productViewDiv.innerHTML = `
                <img src="${product.image.desktop}" alt="${product.name} image">
                `
            }


            productViewDiv.appendChild(incDecDiv)
            productViewDiv.appendChild(addToCartButton)


            let productInfoDiv = document.createElement('div')
            productInfoDiv.classList.add('product-info')

            productInfoDiv.innerHTML = `
                <p class="product-name">${product.category}</p>
                <p class="product-fullname">${product.name}</p>
                <p class="product-price">$${product.price}</p>
            `

            productDiv.appendChild(productViewDiv)
            productDiv.appendChild(productInfoDiv)


            productContianer.appendChild(productDiv)

        });


    }


    productContianer.addEventListener('click', (e) => {


        if(e.target.closest('.inc') || e.target.closest('.dec')){
            let incDecDivElement
            if(e.target.closest('.dec')){
                incDecDivElement = e.target.closest('.dec').parentElement

            }else{
                incDecDivElement = e.target.closest('.inc').parentElement
            }
            const productId = parseInt(incDecDivElement.dataset.productId)
            let productDetailBeforeChange = cartProducts.find(product => product.id === productId)

            if(e.target.closest('.inc')){
                cartProducts = cartProducts.map(product => product.id === productId ? { ...product, quantity: product.quantity + 1} : {...product})

            }else{
                if(productDetailBeforeChange.quantity <= 1){
                    incDecDivElement.parentElement.classList.remove('product-selected')
                    cartProducts = cartProducts.filter(product => product.id !== productId)
                }else{
                    cartProducts = cartProducts.map(product => product.id === productId ? { ...product, quantity: product.quantity - 1} : {...product})
                }
            }

            updateCart()
            let productDetail = cartProducts.find(product => product.id === productId)
            let countElement = incDecDivElement.querySelector('.count')
            countElement.textContent = `${productDetail?.quantity < 10 ? '0' + productDetail?.quantity : productDetail?.quantity}`

            localStorage.setItem('cartProducts', JSON.stringify(cartProducts))
        }

    })

    function updateCart(){


        if(!cartProducts.length){
            cartItemCount.textContent = 'Your Cart (0)'
            emptyCart.style.display = 'block'
            cart.style.display = 'none'
            return
        }

        emptyCart.style.display = 'none'
        cart.style.display = 'block'

        let totalCount = 0
        let totalPrice = 0
        cartListItems.replaceChildren()
        cartProducts.forEach(product => {
            const itemLi = document.createElement('li')
            itemLi.classList.add('item')
            itemLi.dataset.productId = product.id

            const itemInfoDiv = document.createElement('div')
            itemInfoDiv.classList.add('cart-item-info')

            const itemNameP = document.createElement('p')
            itemNameP.classList.add('cart-item-name')
            itemNameP.textContent = product.name

            const itemCountInfoP = document.createElement('p')
            itemCountInfoP.classList.add('cart-item-count-info')
            itemCountInfoP.innerHTML = `
                <span class="item-count">${product.quantity}x</span>
                <span class="item-price">@$${product.price.toFixed(2)}</span>
                <span class="item-total-price">$${(product.price * product.quantity).toFixed(2)}</span>
            `

            itemInfoDiv.append(itemNameP, itemCountInfoP)

            const removeItemButton = document.createElement('button')
            removeItemButton.classList.add('remove-cart-item')
            removeItemButton.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg"  fill="none" viewBox="0 0 10 10"><path fill="#CAAFA7" d="M8.375 9.375 5 6 1.625 9.375l-1-1L4 5 .625 1.625l1-1L5 4 8.375.625l1 1L6 5l3.375 3.375-1 1Z"/></svg>

            `

            removeItemButton.addEventListener('click', (e) => {
                cartProducts = cartProducts.filter(prod => prod.id !== parseInt(itemLi.dataset.productId))
                showProducts()
                updateCart()
                localStorage.setItem('cartProducts', JSON.stringify(cartProducts))

            })

            itemLi.append(itemInfoDiv, removeItemButton)
            cartListItems.appendChild(itemLi)

            totalPrice += product.price * product.quantity
            totalCount += product.quantity

        })

        cartItemCount.textContent = `Your Cart (${totalCount})`
        cartTotalPrice.textContent = `$${totalPrice.toFixed(2)}`

    }


    confirmOrder.addEventListener('click', () => {
        let confirmTotalPrice = document.querySelector('.confirm-total-price')
        let startNewOrder = document.querySelector('.start-new-order')
        orderConfirmed.style.display = 'flex'
        orderConfirmedList.replaceChildren()

        let totalPrice = 0
        cartProducts.forEach(product => {
            const li = document.createElement('li')
            li.classList.add('order-item')

            const itemInfoDiv = document.createElement('div')
            itemInfoDiv.classList.add('order-item-info')

            itemInfoDiv.innerHTML = `
                <img src="${product.image.thumbnail}" alt="${product.name} image">
            `

            const div = document.createElement('div')
            itemInfoDiv.appendChild(div)

            div.innerHTML = `
                <p class="order-item-name">${product.name}</p>
                <p>
                    <span class="order-item-count">${product.quantity}x</span>
                    <span class="order-item-price">@ $${product.price.toFixed(2)}</span>
                </p>
            `

            const para = document.createElement('p')
            para.classList.add('order-item-total')
            para.textContent = `$${(product.price * product.quantity).toFixed(2)}`

            li.append(itemInfoDiv, para)
            orderConfirmedList.appendChild(li)
            totalPrice += product.price * product.quantity

        })

        confirmTotalPrice.textContent = `$${totalPrice.toFixed(2)}`

        startNewOrder.addEventListener('click', () => {
            cartProducts = []
            localStorage.setItem('cartProducts', JSON.stringify(cartProducts))
            orderConfirmed.style.display = 'none'
            document.body.style.overflow = 'visible'
            showProducts()
            updateCart()
        })

        document.body.style.overflow = 'hidden'

    })



    showProducts()
    updateCart()

})
