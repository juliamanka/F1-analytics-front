# Measurements Dashboard (Angular 20)

**Measurements Dashboard** to aplikacja frontendowa napisana w **Angular 20**, służąca do wizualizacji oraz zarządzania danymi pomiarowymi pochodzącymi z systemu **F1 Analytics API**.  
Projekt powstał w ramach zajęć akademickich i prezentuje praktyczne wykorzystanie architektury komponentowej, usług REST oraz reaktywnego programowania w Angularze.

---

##� Spis treści

1. [Opis projektu](#opis-projektu)
2. [Technologie](#technologie)
3. [Struktura katalogów](#struktura-katalogów)
4. [Konfiguracja i uruchomienie](#konfiguracja-i-uruchomienie)
5. [Integracja z API](#integracja-z-api)
6. [Budowanie projektu](#budowanie-projektu)
---

## Opis projektu

Aplikacja umożliwia:
- przeglądanie serii pomiarowych (Series),
- wyświetlanie i filtrowanie pomiarów (Measurements),
- dodawanie i edytowanie danych pomiarowych,
- integrację z backendowym API (**F1 Analytics API**),
- prezentację danych w formie tabel i wykresów.

Dashboard stanowi graficzny interfejs użytkownika dla modelu danych udostępnionego przez backend .NET (API REST).

---

## Technologie

Projekt został utworzony przy użyciu:
- **Angular 20**
- **TypeScript 5**
- **RxJS 7**
- **Angular Material**
- **Chart.js**
- **HTML5 / SCSS**
- **REST API (HTTPClient)**

Dodatkowe narzędzia:
- **Node.js 20+**
- **npm 10+**
- **Angular CLI** – narzędzie do generowania i uruchamiania projektu

---

## Struktura katalogów

```
src/
 ├── app/
 │   ├── components/              # Komponenty UI (widoki, formularze, wykresy)
 │   │   ├── series-list/
 │   │   ├── measurements-table/
 │   │   ├── measurement-form/
 │   │   └── navbar/
 │   ├── services/                # Serwisy (komunikacja z API, logika biznesowa)
 │   │   ├── series.service.ts
 │   │   ├── measurement.service.ts
 │   │   └── auth.service.ts
 │   ├── models/                  # Definicje interfejsów danych
 │   │   ├── series.model.ts
 │   │   ├── measurement.model.ts
 │   │   └── user.model.ts
 │   ├── pages/                   # Widoki główne (routing)
 │   │   ├── dashboard/
 │   │   └── login/
 │   ├── guards/                  # Ochrona tras (AuthGuard)
 │   ├── interceptors/            # Przechwytywanie żądań HTTP (JWT, błędy)
 │   ├── app-routing.module.ts    # Definicje tras
 │   ├── app.module.ts            # Moduł główny aplikacji
 │   └── app.component.ts         # Główny komponent aplikacji
 ├── assets/                      # Zasoby statyczne (grafiki, style)
 ├── environments/                # Konfiguracje środowiskowe
 │   ├── environment.ts
 │   └── environment.prod.ts
 └── index.html                   # Główny plik HTML
```

---

## Konfiguracja i uruchomienie

### 1. Instalacja zależności

Po sklonowaniu projektu uruchom w katalogu głównym:

```bash
npm install
```

### 2. Uruchomienie aplikacji w trybie deweloperskim

```bash
ng serve
```

Aplikacja będzie dostępna pod adresem:
```
http://localhost:4200
```

### 3. Konfiguracja połączenia z API

W pliku `src/environments/environment.ts` należy ustawić adres backendu (np. F1 Analytics API):

```typescript
export const environment = {
  production: false,
  apiUrl: 'https://localhost:5001/api'
};
```

Dla środowiska produkcyjnego (`environment.prod.ts`) podaj właściwy adres serwera.

---

## Integracja z API

Aplikacja komunikuje się z **F1 Analytics API** (REST backend w .NET).  
Wymagane endpointy:

| Zasób | Endpoint | Metoda | Opis |
|--------|-----------|--------|------|
| Seria | `/api/series` | GET | Pobiera wszystkie serie |
| Seria | `/api/series/{id}` | GET | Pobiera pojedynczą serię |
| Pomiary | `/api/measurements` | GET | Pobiera listę pomiarów |
| Pomiary | `/api/measurements` | POST | Dodaje nowy pomiar |
| Użytkownik | `/api/auth/login` | POST | Logowanie i pobranie tokenu JWT |

### Przykład użycia serwisu Angular:
```typescript
@Injectable({ providedIn: 'root' })
export class MeasurementService {
  constructor(private http: HttpClient) {}

  getMeasurements(): Observable<Measurement[]> {
    return this.http.get<Measurement[]>(`${environment.apiUrl}/measurements`);
  }
}
```

---

## Budowanie projektu

Aby zbudować aplikację w wersji produkcyjnej:

```bash
ng build --configuration production
```

Wynikowa paczka znajdzie się w folderze:
```
dist/measurements-dashboard/
```

Można ją następnie wdrożyć na dowolnym serwerze HTTP (np. **Azure Static Web Apps**, **Firebase Hosting** lub **Nginx**).

---

