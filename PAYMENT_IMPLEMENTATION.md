# Guía de Integración Frontend - Sistema de Pagos QBolacel

## 📋 Índice

1. [Endpoints API](#endpoints-api)
2. [Modelos de Datos](#modelos-de-datos)
3. [Flujos de Integración](#flujos-de-integración)
4. [Ejemplos React Web](#ejemplos-react-web)
5. [Ejemplos Kotlin KMP Mobile](#ejemplos-kotlin-kmp-mobile)

---

## 🔗 Endpoints API

### Base URL
```
Production: https://api.qbolacel.com/api
Development: http://localhost:8080/api
```

### Autenticación
Todos los endpoints requieren header:
```
Authorization: Bearer <jwt_token>
```

---

### 1. Checkout Unificado

#### 1.1 Checkout de Marketplace
```http
POST /v1/unified-checkout/marketplace
Content-Type: application/json
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "orderId": "ord_abc123",
  "customer": {
    "firstName": "Juan",
    "lastName": "Pérez",
    "email": "juan@email.com",
    "phone": "+5355555555",
    "countryCode": "CU"
  },
  "successUrl": "https://qbolacel.com/checkout/success?order={orderId}",
  "cancelUrl": "https://qbolacel.com/checkout/cancel?order={orderId}",
  "provider": "TROPIPAY",
  "saveCardForFuture": true,
  "expirationMinutes": 60
}
```

**Response (201):**
```json
{
  "transactionId": "67890abc",
  "transactionSku": "TXN-20251215-ABC12345",
  "status": "PENDING_PAYMENT",
  "paymentUrl": "https://tropipay.com/pay/abc123",
  "shortUrl": "https://tppay.me/abc123",
  "expiresAt": "2025-12-15T17:00:00Z",
  "provider": "TROPIPAY",
  "amount": 45.99,
  "currency": "USD",
  "isDirectCharge": false
}
```

#### 1.2 Checkout de Recarga
```http
POST /v1/unified-checkout/recharge
```

**Request:**
```json
{
  "rechargeOrderId": "rch_xyz789",
  "customer": {
    "firstName": "Juan",
    "lastName": "Pérez",
    "email": "juan@email.com"
  },
  "successUrl": "https://qbolacel.com/recharge/success",
  "cancelUrl": "https://qbolacel.com/recharge/cancel",
  "saveCardForFuture": true
}
```

#### 1.3 Pago Rápido (1-Clic)
```http
POST /v1/unified-checkout/quick-recharge
```

**Request:**
```json
{
  "rechargeOrderId": "rch_xyz789",
  "savedPaymentMethodId": "pm_abc123"
}
```

**Response (200):**
```json
{
  "transactionId": "txn_def456",
  "status": "COMPLETED",
  "amount": 20.00,
  "currency": "USD",
  "isDirectCharge": true
}
```

#### 1.4 Consultar Estado
```http
GET /v1/unified-checkout/status/{transactionId}
```

---

### 2. Métodos de Pago Guardados

#### 2.1 Listar Tarjetas
```http
GET /v1/payment-methods
```

**Response:**
```json
[
  {
    "id": "pm_abc123",
    "displayName": "VISA •••• 4242",
    "last4": "4242",
    "brand": "VISA",
    "expMonth": 12,
    "expYear": 2027,
    "isDefault": true,
    "isExpired": false
  }
]
```

#### 2.2 Eliminar Tarjeta
```http
DELETE /v1/payment-methods/{methodId}
```

#### 2.3 Establecer como Predeterminada
```http
PUT /v1/payment-methods/{methodId}/default
```

---

## 📦 Modelos de Datos

### TypeScript (React)

```typescript
// types/payment.ts

export interface CustomerInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  countryCode?: string;
}

export interface MarketplaceCheckoutRequest {
  orderId: string;
  customer?: CustomerInfo;
  successUrl: string;
  cancelUrl: string;
  provider?: string;
  savedPaymentMethodId?: string;
  saveCardForFuture?: boolean;
  expirationMinutes?: number;
}

export interface CheckoutResponse {
  transactionId: string;
  transactionSku: string;
  status: TransactionStatus;
  paymentUrl: string | null;
  shortUrl: string | null;
  expiresAt: string | null;
  provider: string;
  amount: number;
  currency: string;
  isDirectCharge: boolean;
}

export type TransactionStatus = 
  | 'CREATED'
  | 'PENDING_PAYMENT'
  | 'PROCESSING'
  | 'COMPLETED'
  | 'FAILED'
  | 'CANCELLED'
  | 'EXPIRED';

export interface SavedPaymentMethod {
  id: string;
  displayName: string;
  last4: string;
  brand: string;
  expMonth: number;
  expYear: number;
  isDefault: boolean;
  isExpired: boolean;
}
```

### Kotlin (KMP)

```kotlin
// shared/src/commonMain/kotlin/data/model/Payment.kt

@Serializable
data class CustomerInfo(
    val firstName: String,
    val lastName: String,
    val email: String,
    val phone: String? = null,
    val countryCode: String? = null
)

@Serializable
data class MarketplaceCheckoutRequest(
    val orderId: String,
    val customer: CustomerInfo? = null,
    val successUrl: String,
    val cancelUrl: String,
    val provider: String? = null,
    val savedPaymentMethodId: String? = null,
    val saveCardForFuture: Boolean? = false
)

@Serializable
data class CheckoutResponse(
    val transactionId: String,
    val transactionSku: String,
    val status: String,
    val paymentUrl: String?,
    val amount: Double,
    val currency: String,
    val isDirectCharge: Boolean = false
)

@Serializable
data class SavedPaymentMethod(
    val id: String,
    val displayName: String,
    val last4: String,
    val brand: String,
    val expMonth: Int,
    val expYear: Int,
    val isDefault: Boolean,
    val isExpired: Boolean
)
```

---

## 🔄 Flujos de Integración

### Flujo 1: Checkout con Redirección

```
1. Usuario completa carrito
   ↓
2. POST /v1/unified-checkout/marketplace
   - saveCardForFuture: true (opcional)
   ↓
3. Backend retorna paymentUrl
   ↓
4. Frontend redirige: window.location.href = paymentUrl
   ↓
5. Usuario paga en TropiPay
   ↓
6. TropiPay redirige a successUrl
   ↓
7. GET /v1/unified-checkout/status/{id}
```

### Flujo 2: Pago Rápido (1-Clic)

```
1. Usuario selecciona recarga
   ↓
2. GET /v1/payment-methods (mostrar tarjetas)
   ↓
3. Usuario selecciona tarjeta
   ↓
4. POST /v1/unified-checkout/quick-recharge
   ↓
5. Respuesta inmediata: COMPLETED o FAILED
```

---

## ⚛️ Ejemplos React Web

### API Service

```typescript
// services/paymentApi.ts

import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || 'https://api.qbolacel.com/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' }
});

// Interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const checkoutMarketplace = async (
  request: MarketplaceCheckoutRequest
): Promise<CheckoutResponse> => {
  const { data } = await api.post('/v1/unified-checkout/marketplace', request);
  return data;
};

export const quickRecharge = async (
  request: QuickRechargeRequest
): Promise<CheckoutResponse> => {
  const { data } = await api.post('/v1/unified-checkout/quick-recharge', request);
  return data;
};

export const getPaymentMethods = async (): Promise<SavedPaymentMethod[]> => {
  const { data } = await api.get('/v1/payment-methods');
  return data;
};

export const deletePaymentMethod = async (id: string): Promise<void> => {
  await api.delete(`/v1/payment-methods/${id}`);
};
```

### Hook de Checkout

```typescript
// hooks/useCheckout.ts

import { useState } from 'react';
import { checkoutMarketplace, quickRecharge } from '../services/paymentApi';

export const useCheckout = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initiateCheckout = async (orderId: string, saveCard: boolean = false) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await checkoutMarketplace({
        orderId,
        successUrl: `${window.location.origin}/checkout/success`,
        cancelUrl: `${window.location.origin}/checkout/cancel`,
        saveCardForFuture: saveCard
      });
      
      if (response.paymentUrl) {
        window.location.href = response.paymentUrl;
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const processQuickPayment = async (
    rechargeOrderId: string, 
    savedMethodId: string
  ) => {
    setIsLoading(true);
    try {
      const result = await quickRecharge({
        rechargeOrderId,
        savedPaymentMethodId: savedMethodId
      });
      return result;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, error, initiateCheckout, processQuickPayment };
};
```

### Componente de Checkout

```tsx
// components/CheckoutButton.tsx

import React, { useState } from 'react';
import { useCheckout } from '../hooks/useCheckout';
import { usePaymentMethods } from '../hooks/usePaymentMethods';

interface Props {
  orderId: string;
  amount: number;
  currency: string;
}

export const CheckoutButton: React.FC<Props> = ({ orderId, amount, currency }) => {
  const [saveCard, setSaveCard] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  
  const { isLoading, initiateCheckout, processQuickPayment } = useCheckout();
  const { paymentMethods } = usePaymentMethods();

  const handlePay = async () => {
    if (selectedMethod) {
      // Pago rápido
      const result = await processQuickPayment(orderId, selectedMethod);
      if (result.status === 'COMPLETED') {
        alert('¡Pago exitoso!');
      }
    } else {
      // Checkout con redirección
      await initiateCheckout(orderId, saveCard);
    }
  };

  return (
    <div>
      {paymentMethods.length > 0 && (
        <div>
          <h4>Tarjetas guardadas</h4>
          {paymentMethods.map(method => (
            <label key={method.id}>
              <input
                type="radio"
                name="method"
                checked={selectedMethod === method.id}
                onChange={() => setSelectedMethod(method.id)}
              />
              {method.displayName}
            </label>
          ))}
          <label>
            <input
              type="radio"
              name="method"
              checked={selectedMethod === null}
              onChange={() => setSelectedMethod(null)}
            />
            Usar otra tarjeta
          </label>
        </div>
      )}

      {!selectedMethod && (
        <label>
          <input
            type="checkbox"
            checked={saveCard}
            onChange={(e) => setSaveCard(e.target.checked)}
          />
          Guardar tarjeta
        </label>
      )}

      <button onClick={handlePay} disabled={isLoading}>
        {isLoading ? 'Procesando...' : 
         selectedMethod ? `Pagar ${currency} ${amount} (1-clic)` :
         `Pagar ${currency} ${amount}`}
      </button>
    </div>
  );
};
```

---

## 📱 Ejemplos Kotlin KMP Mobile

### API Client

```kotlin
// shared/src/commonMain/kotlin/data/api/PaymentApi.kt

class PaymentApi(
    private val client: HttpClient,
    private val baseUrl: String
) {
    suspend fun checkoutMarketplace(
        token: String,
        request: MarketplaceCheckoutRequest
    ): CheckoutResponse {
        return client.post("$baseUrl/v1/unified-checkout/marketplace") {
            header(HttpHeaders.Authorization, "Bearer $token")
            contentType(ContentType.Application.Json)
            setBody(request)
        }.body()
    }
    
    suspend fun quickRecharge(
        token: String,
        request: QuickRechargeRequest
    ): CheckoutResponse {
        return client.post("$baseUrl/v1/unified-checkout/quick-recharge") {
            header(HttpHeaders.Authorization, "Bearer $token")
            contentType(ContentType.Application.Json)
            setBody(request)
        }.body()
    }
    
    suspend fun getPaymentMethods(token: String): List<SavedPaymentMethod> {
        return client.get("$baseUrl/v1/payment-methods") {
            header(HttpHeaders.Authorization, "Bearer $token")
        }.body()
    }
}
```

### Repository

```kotlin
// shared/src/commonMain/kotlin/data/repository/PaymentRepository.kt

class PaymentRepository(
    private val api: PaymentApi,
    private val tokenProvider: () -> String?
) {
    suspend fun checkoutMarketplace(
        orderId: String,
        saveCard: Boolean = false
    ): Result<CheckoutResponse> = runCatching {
        api.checkoutMarketplace(
            token = tokenProvider() ?: throw Exception("No auth"),
            request = MarketplaceCheckoutRequest(
                orderId = orderId,
                successUrl = "qbolacel://checkout/success",
                cancelUrl = "qbolacel://checkout/cancel",
                saveCardForFuture = saveCard
            )
        )
    }
    
    suspend fun quickRecharge(
        rechargeOrderId: String,
        savedMethodId: String
    ): Result<CheckoutResponse> = runCatching {
        api.quickRecharge(
            token = tokenProvider() ?: throw Exception("No auth"),
            request = QuickRechargeRequest(
                rechargeOrderId = rechargeOrderId,
                savedPaymentMethodId = savedMethodId
            )
        )
    }
    
    suspend fun getPaymentMethods(): Result<List<SavedPaymentMethod>> = runCatching {
        api.getPaymentMethods(tokenProvider() ?: throw Exception("No auth"))
    }
}
```

### ViewModel

```kotlin
// shared/src/commonMain/kotlin/presentation/CheckoutViewModel.kt

class CheckoutViewModel(
    private val repository: PaymentRepository
) {
    private val _state = MutableStateFlow(CheckoutState())
    val state: StateFlow<CheckoutState> = _state.asStateFlow()
    
    private val _events = MutableSharedFlow<CheckoutEvent>()
    val events: SharedFlow<CheckoutEvent> = _events.asSharedFlow()
    
    fun checkout(orderId: String, saveCard: Boolean) {
        viewModelScope.launch {
            _state.update { it.copy(isLoading = true) }
            
            repository.checkoutMarketplace(orderId, saveCard)
                .onSuccess { response ->
                    if (response.paymentUrl != null) {
                        _events.emit(CheckoutEvent.OpenUrl(response.paymentUrl))
                    }
                }
                .onFailure { error ->
                    _state.update { it.copy(error = error.message) }
                }
            
            _state.update { it.copy(isLoading = false) }
        }
    }
    
    fun quickPay(rechargeId: String, methodId: String) {
        viewModelScope.launch {
            _state.update { it.copy(isLoading = true) }
            
            repository.quickRecharge(rechargeId, methodId)
                .onSuccess { response ->
                    if (response.status == "COMPLETED") {
                        _events.emit(CheckoutEvent.Success)
                    }
                }
                .onFailure { error ->
                    _events.emit(CheckoutEvent.Error(error.message ?: "Error"))
                }
            
            _state.update { it.copy(isLoading = false) }
        }
    }
}

data class CheckoutState(
    val isLoading: Boolean = false,
    val error: String? = null
)

sealed class CheckoutEvent {
    data class OpenUrl(val url: String) : CheckoutEvent()
    object Success : CheckoutEvent()
    data class Error(val message: String) : CheckoutEvent()
}
```

### Compose UI (Android)

```kotlin
// androidApp/src/main/kotlin/ui/CheckoutScreen.kt

@Composable
fun CheckoutScreen(
    viewModel: CheckoutViewModel,
    orderId: String,
    amount: Double
) {
    val state by viewModel.state.collectAsState()
    val context = LocalContext.current
    
    LaunchedEffect(Unit) {
        viewModel.events.collect { event ->
            when (event) {
                is CheckoutEvent.OpenUrl -> {
                    val intent = Intent(Intent.ACTION_VIEW, Uri.parse(event.url))
                    context.startActivity(intent)
                }
                is CheckoutEvent.Success -> {
                    Toast.makeText(context, "¡Pago exitoso!", Toast.LENGTH_SHORT).show()
                }
                is CheckoutEvent.Error -> {
                    Toast.makeText(context, event.message, Toast.LENGTH_SHORT).show()
                }
            }
        }
    }
    
    Column(modifier = Modifier.padding(16.dp)) {
        Text("Total: $${amount}", style = MaterialTheme.typography.h5)
        
        Spacer(modifier = Modifier.height(16.dp))
        
        Button(
            onClick = { viewModel.checkout(orderId, saveCard = true) },
            modifier = Modifier.fillMaxWidth(),
            enabled = !state.isLoading
        ) {
            Text(if (state.isLoading) "Procesando..." else "Pagar")
        }
    }
}
```

---

## 🔔 Deep Links (Mobile)

### Android - AndroidManifest.xml

```xml
<activity android:name=".MainActivity">
    <intent-filter>
        <action android:name="android.intent.action.VIEW" />
        <category android:name="android.intent.category.DEFAULT" />
        <category android:name="android.intent.category.BROWSABLE" />
        
        <data
            android:scheme="qbolacel"
            android:host="checkout" />
    </intent-filter>
</activity>
```

### iOS - Info.plist

```xml
<key>CFBundleURLTypes</key>
<array>
    <dict>
        <key>CFBundleURLSchemes</key>
        <array>
            <string>qbolacel</string>
        </array>
    </dict>
</array>
```

---

## ✅ Checklist de Implementación

### Web (React)
- [ ] Configurar API service con auth
- [ ] Implementar `useCheckout` hook
- [ ] Implementar `usePaymentMethods` hook
- [ ] Crear componente de checkout
- [ ] Manejar redirección a proveedor
- [ ] Páginas success/cancel

### Mobile (KMP)
- [ ] Configurar Ktor client
- [ ] Implementar PaymentApi
- [ ] Implementar Repository
- [ ] Crear ViewModel
- [ ] UI de checkout
- [ ] Configurar deep links
- [ ] Manejar apertura de navegador

---

## 📞 URLs Importantes

- **API Base:** https://api.qbolacel.com/api
- **Swagger UI:** https://api.qbolacel.com/api/swagger-ui.html
- **Documentación Backend:** [PAYMENT_SYSTEM.md](./PAYMENT_SYSTEM.md)

