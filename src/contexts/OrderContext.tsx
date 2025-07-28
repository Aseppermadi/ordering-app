"use client"

import type React from "react"
import { createContext, useContext, useReducer, useEffect } from "react"
import { mockOrders } from "../data/mockData"

interface OrderItem {
  productId: string
  name: string
  quantity: number
  price: number
}

interface Order {
  id: string
  orderNumber: number
  tableNumber: number
  items: OrderItem[]
  totalAmount: number
  paymentStatus: "PAID" | "UNPAID"
  orderStatus: "RECEIVED" | "PREPARING" | "COMPLETED"
  createdAt: string
  customerName?: string
  customerPhone?: string
  notes?: string
}

interface OrderState {
  orders: Order[]
  currentOrder: Order | null
  isLoading: boolean
}

type OrderAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "LOAD_ORDERS_SUCCESS"; payload: Order[] }
  | { type: "ADD_ORDER"; payload: Order }
  | { type: "UPDATE_ORDER"; payload: { id: string; updates: Partial<Order> } }
  | { type: "SET_CURRENT_ORDER"; payload: Order | null }

const initialState: OrderState = {
  orders: [],
  currentOrder: null,
  isLoading: false,
}

const orderReducer = (state: OrderState, action: OrderAction): OrderState => {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, isLoading: action.payload }

    case "LOAD_ORDERS_SUCCESS":
      return {
        ...state,
        orders: action.payload,
        isLoading: false,
      }

    case "ADD_ORDER":
      return {
        ...state,
        orders: [action.payload, ...state.orders],
        currentOrder: action.payload,
      }

    case "UPDATE_ORDER":
      return {
        ...state,
        orders: state.orders.map((order) =>
          order.id === action.payload.id ? { ...order, ...action.payload.updates } : order,
        ),
        currentOrder:
          state.currentOrder?.id === action.payload.id
            ? { ...state.currentOrder, ...action.payload.updates }
            : state.currentOrder,
      }

    case "SET_CURRENT_ORDER":
      return { ...state, currentOrder: action.payload }

    default:
      return state
  }
}

interface OrderContextType extends OrderState {
  createOrder: (orderData: Omit<Order, "id" | "orderNumber" | "createdAt">) => Promise<Order>
  updateOrderStatus: (id: string, status: Order["orderStatus"]) => void
  updatePaymentStatus: (id: string, status: Order["paymentStatus"]) => void
  loadOrders: () => Promise<void>
  refreshOrders: () => void
}

const OrderContext = createContext<OrderContextType | undefined>(undefined)

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(orderReducer, initialState)

  // Load mock data on mount
  useEffect(() => {
    loadOrders()
  }, [])

  const loadOrders = async (): Promise<void> => {
    dispatch({ type: "SET_LOADING", payload: true })

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 500))

      // In a real app, this would be an API call
      // const response = await fetch('/api/orders')
      // const orders = await response.json()

      // For demo, use mock data
      dispatch({ type: "LOAD_ORDERS_SUCCESS", payload: mockOrders })
    } catch (error) {
      console.error("Failed to load orders:", error)
      dispatch({ type: "SET_LOADING", payload: false })
    }
  }

  const refreshOrders = () => {
    // Simulate new orders coming in
    const newOrdersCount = Math.floor(Math.random() * 3) + 1
    const updatedOrders = [...mockOrders]

    // Add some random new orders
    for (let i = 0; i < newOrdersCount; i++) {
      const newOrder: Order = {
        id: `order_new_${Date.now()}_${i}`,
        orderNumber: 200 + Math.floor(Math.random() * 100),
        tableNumber: Math.floor(Math.random() * 15) + 1,
        items: [
          {
            productId: "1",
            name: "Nasi Goreng Spesial",
            quantity: 1,
            price: 25000,
          },
        ],
        totalAmount: 25000,
        paymentStatus: Math.random() > 0.5 ? "PAID" : "UNPAID",
        orderStatus: "RECEIVED",
        createdAt: new Date().toISOString(),
        customerName: `Customer ${Math.floor(Math.random() * 100)}`,
        customerPhone: `0812345678${Math.floor(Math.random() * 100)
          .toString()
          .padStart(2, "0")}`,
      }
      updatedOrders.unshift(newOrder)
    }

    dispatch({ type: "LOAD_ORDERS_SUCCESS", payload: updatedOrders })
  }

  const createOrder = async (orderData: Omit<Order, "id" | "orderNumber" | "createdAt">): Promise<Order> => {
    const newOrder: Order = {
      ...orderData,
      id: `order_${Date.now()}`,
      orderNumber: Math.floor(Math.random() * 1000) + 100,
      createdAt: new Date().toISOString(),
    }

    // Simulate API call
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // In a real app:
      // const response = await fetch('/api/orders', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(newOrder)
      // })
      // const savedOrder = await response.json()

      dispatch({ type: "ADD_ORDER", payload: newOrder })
      return newOrder
    } catch (error) {
      console.error("Failed to create order:", error)
      throw error
    }
  }

  const updateOrderStatus = (id: string, status: Order["orderStatus"]) => {
    dispatch({ type: "UPDATE_ORDER", payload: { id, updates: { orderStatus: status } } })

    // Simulate API call
    // fetch(`/api/orders/${id}`, {
    //   method: 'PATCH',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ orderStatus: status })
    // })
  }

  const updatePaymentStatus = (id: string, status: Order["paymentStatus"]) => {
    dispatch({ type: "UPDATE_ORDER", payload: { id, updates: { paymentStatus: status } } })

    // Simulate API call
    // fetch(`/api/orders/${id}`, {
    //   method: 'PATCH',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ paymentStatus: status })
    // })
  }

  return (
    <OrderContext.Provider
      value={{
        ...state,
        createOrder,
        updateOrderStatus,
        updatePaymentStatus,
        loadOrders,
        refreshOrders,
      }}
    >
      {children}
    </OrderContext.Provider>
  )
}

export const useOrder = () => {
  const context = useContext(OrderContext)
  if (!context) {
    throw new Error("useOrder must be used within an OrderProvider")
  }
  return context
}
