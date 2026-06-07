# Security Specification - Firestore Collection Hardening

This specification defines the security architecture and validation logic for the Firestore database of the Waste Management System (Sistema de Gestión Integral de Residuos).

## Data Invariants

1. **Registro Interno (Internal Stock Acopios):**
   - Must have a hardcoded `tipo: "interno"`.
   - Category can only be one of four permitted environmental groups.
   - Id must be a valid integer identifier (typically Unix timestamp).
   - Numeric quantities must be strictly positive and declared with standard units of measurement.

2. **Retiro Externo (External Dispatches/Manifiestos):**
   - Must have a hardcoded `tipo: "externo"`.
   - Category must belong to the exact identical classification.
   - Must hold logistics fields: transport company name, vehicular plate (patente), certified environmental manifest number, and operador final.
   - `pdfCargado` is a strict boolean value tracking if the manifest document is physically scanned.

## The "Dirty Dozen" Attack Payloads (Validation Failure Cases)

We define 12 distinct payload patterns that our `firestore.rules` will explicitly reject to prevent corruption or denial of wallet attacks:

1. **Payload 1 (Shadow field Injection):**
   ```json
   { "id": 123456, "tipo": "interno", "categoria": "Residuos Peligrosos", "corriente": "Y1", "fecha": "06/06/2026", "cantidad": 500, "unidad": "Kg", "isAdmin": true }
   ```
   *Rejected because:* Contains unmapped custom claim `isAdmin`.

2. **Payload 2 (Category Poisoning):**
   ```json
   { "id": 123456, "tipo": "interno", "categoria": "Extremely Toxic Nuclear Residues", "corriente": "Y1", "fecha": "06/06/2026", "quantity": 500, "unidad": "Kg" }
   ```
   *Rejected because:* Category value is outside of the permitted Enum values of standard waste categories.

3. **Payload 3 (Type Spoofing - Quantity):**
   ```json
   { "id": 123456, "tipo": "interno", "categoria": "Residuos Peligrosos", "corriente": "Y1", "fecha": "06/06/2026", "cantidad": "five hundred kilograms", "unidad": "Kg" }
   ```
   *Rejected because:* Quantity field is injected as a string instead of a valid number.

4. **Payload 4 (Immense String - Buffer Overflow Attempt):**
   ```json
   { "id": 123456, "tipo": "interno", "categoria": "Residuos Peligrosos", "corriente": "A".repeat(1000000), "fecha": "06/06/2026", "cantidad": 500, "unidad": "Kg" }
   ```
   *Rejected because:* Stream (corriente) exceeds maximum string boundary check of 200 characters.

5. **Payload 5 (Identifier Poisoning - ID String Injection):**
   The database ID is requested as `/registros/!!malicious---path!!`
   *Rejected because:* The route parameter is sanitized and restricted to clean alphanumeric strings.

6. **Payload 6 (State Tampering - Immutable Kind Modification in update):**
   Trying to change `tipo` from "interno" to "externo" on a registered record.
   *Rejected because:* Changing core type descriptor is blocked after creation.

7. **Payload 7 (Unbound Array / Memory Exhaustion attempt):**
   Adding long array lists to unmapped properties.
   *Rejected because:* Properties are strict, schemas enforce EXACT key counts.

8. **Payload 8 (Logistics Poisoning - License Plate Format):**
   ```json
   { "id": 123456, "tipo": "externo", "categoria": "Residuos Peligrosos", "corriente": "Y9", "fecha": "06/06/2026", "manifesto": "M-8899", "cantEst": 100, "unidad": "Kg", "transportista": "Transportes SA", "fechaRetiro": "06/06/2026", "patente": "ABC".repeat(1000), "operador": "Recicladora SA", "numCert": "C-9988", "pdfCargado": true }
   ```
   *Rejected because:* Patente string size exceeds vehicular parameters (maximum size 15).

9. **Payload 9 (Date Spoofing):**
   ```json
   { "id": 123456, "tipo": "interno", "categoria": "Residuos Peligrosos", "corriente": "Y1", "fecha": "Yesterday", "cantidad": 50, "unidad": "Kg" }
   ```
   *Rejected because:* Reject non-formatted date structures.

10. **Payload 10 (Null field omissions):**
    ```json
    { "id": 123456, "tipo": "interno", "categoria": "Residuos Peligrosos", "cantidad": 50 }
    ```
    *Rejected because:* Omit essential attributes in internal registries (missing `corriente`, `fecha`, etc.)

11. **Payload 11 (Manifest Type Corruption):**
    ```json
    { "id": 123456, "tipo": "externo", "categoria": "Residuos Peligrosos", "corriente": "Y9", "fecha": "06/06/2026", "manifesto": "M-8899", "cantEst": 100, "unidad": "Kg", "transportista": "Transportes SA", "fechaRetiro": "06/06/2026", "patente": "AAA111", "operador": "Recicladora SA", "numCert": "C-9988", "pdfCargado": "YES" }
    ```
    *Rejected because:* `pdfCargado` must strictly be a boolean type, not string.

12. **Payload 12 (Negative weights):**
    ```json
    { "id": 123456, "tipo": "interno", "categoria": "Residuos Peligrosos", "corriente": "Y1", "fecha": "06/06/2026", "cantidad": -100, "unidad": "Kg" }
    ```
    *Rejected because:* Quantities must be greater than or equal to zero.
