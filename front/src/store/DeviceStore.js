import { makeAutoObservable } from "mobx"

export default class DeviceStore {
    constructor() {
        this._types = [
            {id: 1, name: "Холодильник"},
            {id: 2, name: "Телевизор"},
            {id: 3, name: "Ноутбук"},
            {id: 4, name: "Смартфон"},
            {id: 5, name: "Наушники"},
            {id: 6, name: "Клавиатура"},
            {id: 7, name: "Монитор"},
        ]
        this._brands = [
            {id: 1, name: "Samsung"},
            {id: 2, name: "Apple"},
            {id: 3, name: "Xiaomi"},
            {id: 4, name: "Sony"},
        ]
        this._devices = [
            {id: 1, name: "Samsung Galaxy S20", price: 1000, rating: 5, img: "https://via.placeholder.com/150"},
            {id: 2, name: "Samsung Galaxy S20", price: 1000, rating: 5, img: "https://via.placeholder.com/150"},
            {id: 3, name: "Samsung Galaxy S20", price: 1000, rating: 5, img: "https://via.placeholder.com/150"},
            {id: 4, name: "Samsung Galaxy S20", price: 1000, rating: 5, img: "https://via.placeholder.com/150"},
        ]
        makeAutoObservable(this)
    }

    setBrands(brands) {
        this._brands = brands
    }

    setTypes(types) {
        this._types = types
    }

    setDevices(devices) {
        this._devices = devices
    }

    

    get types() {
        return this._types
    }
    
    get brands() {
        return this._brands
    }

    get devices() {
        return this._devices
    }
}
