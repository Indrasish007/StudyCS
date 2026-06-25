# 🗄️ Database Management Systems (DBMS) — Complete Semester Exam Notes
> **Source:** Based on the high-yield **"Complete DBMS in One Shot | Semester Exam"** One-Shot Lecture by Sanchit Jain (KnowledgeGate).

---

## 📌 Course Outline & Timestamps
- 🕒 **Chapter 0** | Introduction & Roadmap
- 🕒 **Chapter 1** | Basics of DBMS
- 🕒 **Chapter 2** | Entity-Relationship (ER) Model
- 🕒 **Chapter 3** | Functional Dependencies (FDs) & Key Extraction
- 🕒 **Chapter 4** | Database Normalization (1NF–BCNF–4NF)
- 🕒 **Chapter 5** | Indexing Techniques
- 🕒 **Chapter 6** | Structured Query Language (SQL)
- 🕒 **Chapter 7** | Relational Algebra & Relational Calculus
- 🕒 **Chapter 8** | Transaction Management & ACID Properties
- 🕒 **Chapter 9** | Concurrency Control

---

## 📁 Chapter 1: Basics of DBMS

### 1.1 Fundamental Concepts
*   **Data:** Raw, unorganized, and unprocessed facts, observations, or figures (e.g., "101", "John", "50000").
*   **Information:** Data that has been processed, structured, formatted, or presented in a meaningful context (e.g., "Employee ID 101, named John, has a salary of $50,000").
*   **Database:** A systematic, logically organized, and sharing-enabled collection of related data.
*   **DBMS (Database Management System):** A specialized software package designed to define, store, manipulate, retrieve, and manage databases efficiently and securely (e.g., MySQL, Oracle, PostgreSQL, SQL Server).

---

### 1.2 File System vs. Database Management System
Before DBMS, data was managed using traditional operating system files. This approach had severe limitations:

| Feature / Problem | File System Approach | DBMS Approach |
| :--- | :--- | :--- |
| **Data Redundancy & Inconsistency** | **High:** Multiple copies of the same data are stored in different files, leading to storage waste and conflicting records. | **Low:** Centralized storage database architecture minimizes duplication; updates propagate automatically. |
| **Data Access & Querying** | **Difficult:** Requires writing custom programs (e.g., in C/Java) to search, filter, or retrieve specific data. | **Easy:** Standardized, declarative querying languages (SQL) allow rapid data extraction. |
| **Data Isolation** | **High:** Data is scattered in different files and formats, making integration highly complex. | **Low:** Integrated logical schema brings all data entities into a unified view. |
| **Concurrent Access** | **Unsafe:** If two users edit the same file simultaneously, updates are overwritten (loss of data integrity). | **Safe:** Lock-based and time-stamp protocols manage concurrent operations safely. |
| **Security & Authorization** | **Basic:** File-level access permissions (Read/Write/Execute) are too coarse. | **Granular:** Column, table, and row-level access control based on user roles. |
| **Crash Recovery** | **Absent/Weak:** If a system crashes mid-write, files get corrupted. | **Robust:** Write-ahead logging (WAL) and recovery managers restore state using transaction logs. |

---

### 1.3 Three-Schema Architecture (ANSI-SPARC)
To hide complexity and provide logical/physical separation of data, DBMS uses a **Three-Level Architecture**:

```
┌──────────────────────────────────────────────┐
│         External Level (View Schema)         │
│   User A View | User B View | User C View    │
└──────────────────────────────────────────────┘
                       │  Logical Data Independence
┌──────────────────────────────────────────────┐
│      Conceptual Level (Logical Schema)       │
│  Tables, Entities, Relationships, Constraints│
└──────────────────────────────────────────────┘
                       │  Physical Data Independence
┌──────────────────────────────────────────────┐
│      Internal Level (Physical Schema)        │
│  Indexes, File Organization, Block Sizes     │
└──────────────────────────────────────────────┘
```

1.  **External Level (View Schema):**
    *   The highest level of abstraction.
    *   Defines how end-users or application programs interact with the database.
    *   Allows different users to see custom, simplified views of the same database based on their roles.
2.  **Conceptual Level (Logical Schema):**
    *   The middle level of abstraction.
    *   Defines *what* data is stored in the database and *what relationships* exist among those data items.
    *   Contains tables, schemas, entities, data types, and integrity constraints without worrying about physical storage.
3.  **Internal Level (Physical Schema):**
    *   The lowest level of database design.
    *   Defines *how* the data is physically stored in the secondary storage devices.
    *   Describes block allocations, record sizes, index structures (B+ trees, hashing), and data compression techniques.

---

### 1.4 Data Independence
Data independence refers to the ability to modify schema definition at one level without affecting the schemas at higher levels.

```
┌──────────────────────────────────────────────┐
│             External View / Schema           │
└──────────────────────────────────────────────┘
                       ▲
                       │  [Logical Data Independence]
                       ▼
┌──────────────────────────────────────────────┐
│           Conceptual / Logical Schema        │
└──────────────────────────────────────────────┘
                       ▲
                       │  [Physical Data Independence]
                       ▼
┌──────────────────────────────────────────────┐
│           Internal / Physical Schema         │
└──────────────────────────────────────────────┘
```

*   **Logical Data Independence:**
    *   The ability to modify the conceptual schema (e.g., adding/deleting columns, split/merge tables) without changing the external schema or existing application programs.
    *   *Example:* If a new column `DateOfBirth` is added to a `Student` table, the existing queries that select only `StudentID` and `StudentName` do not break.
*   **Physical Data Independence:**
    *   The ability to modify the physical schema (e.g., changing index types, migrating from HDD to SSD, altering block size) without changing the conceptual/logical schema.
    *   *Example:* Creating a B+ Tree index on the `Email` column to speed up queries does not change the table design or SQL code structure.

---

### 1.5 OLTP vs. OLAP
| Feature | OLTP (Online Transaction Processing) | OLAP (Online Analytical Processing) |
| :--- | :--- | :--- |
| **Purpose** | Day-to-day operations (INSERT/UPDATE/DELETE) | Business intelligence & reporting (SELECT) |
| **Data Volume** | Small, frequent transactions | Large, infrequent batch queries |
| **Database Size** | Relatively small (GBs) | Very large (TBs–PBs) |
| **Users** | Many concurrent end-users | Few analysts |
| **Examples** | Banking, e-commerce, ticketing | Data warehousing, business analytics |
| **Schema** | Highly normalized (3NF/BCNF) | Denormalized (Star Schema, Snowflake) |

---

## 📊 Chapter 2: Entity-Relationship (ER) Model

The Entity-Relationship (ER) model is a visual blueprint of a database representing real-world entities, attributes, and relationships. It is converted into physical relational tables during the implementation phase.

### 2.1 Core Elements
*   **Entity:** A distinct, real-world object or event that is distinguishable from other objects (e.g., a specific `Student`, `Course`, `Employee`).
    *   *Representation:* Rectangle.
*   **Entity Set:** A collection of entities of the same type sharing similar properties (e.g., all Students in a university).
*   **Attribute:** Characteristics or properties that describe an entity (e.g., `Name`, `RollNumber`, `Salary`).
    *   *Representation:* Oval (connected to the entity).

---

### 2.2 Classification of Attributes
Understanding attribute types is essential for proper schema design:

```
                  ┌──────────────────────────────┐
                  │          ATTRIBUTES          │
                  └──────────────┬───────────────┘
         ┌───────────────┬───────┴───────┬───────────────┐
         ▼               ▼               ▼               ▼
   ┌───────────┐   ┌───────────┐   ┌───────────┐   ┌───────────┐
   │  Simple   │   │Single-Val │   │ Key Att.  │   │  Derived  │
   │    vs.    │   │    vs.    │   │(Underline)│   │  (Dashed  │
   │ Composite │   │Multi-Val  │   └───────────┘   │   Oval)   │
   └───────────┘   └───────────┘                   └───────────┘
```

1.  **Simple vs. Composite:**
    *   **Simple Attributes:** Atomic values that cannot be split further (e.g., `RollNumber`, `Salary`).
    *   **Composite Attributes:** Can be divided into smaller sub-parts to represent independent values (e.g., `Name` split into `First_Name`, `Middle_Name`, `Last_Name`).
2.  **Single-valued vs. Multi-valued:**
    *   **Single-valued:** Holds exactly one value for a given entity instance (e.g., `DateOfBirth`, `AadhaarNumber`).
    *   **Multi-valued:** Can hold multiple values for a single entity (e.g., `Phone_Number` (mobile and home), `Skills`).
    *   *Representation:* Double Oval.
3.  **Derived Attributes:**
    *   Values that are not stored directly in the database but calculated from other stored attributes.
    *   *Example:* Calculating `Age` dynamically using the current date and `DateOfBirth`.
    *   *Representation:* Dashed Oval.
4.  **Key Attribute:**
    *   An attribute whose values uniquely identify each entity in an entity set (e.g., `Roll_Number` in `Student`).
    *   *Representation:* Oval with underlined text.

---

### 2.3 Strong vs. Weak Entity Sets

| Characteristic | Strong Entity Set | Weak Entity Set |
| :--- | :--- | :--- |
| **Primary Key** | Has its own primary key (e.g., `Emp_ID`). | Does not have a primary key. It relies on a strong entity. |
| **Discriminator** | Not required (uses primary key). | Uses a **partial key / discriminator** (dashed underline) to differentiate between weak entities sharing the same owner. |
| **Dependency** | Independent existence. | Existentially dependent on an identifying owner entity set. |
| **ER representation** | Single Rectangle | Double Rectangle |
| **Relationship representation**| Single Diamond | Double Diamond (Identifying Relationship) |

> [!NOTE]
> *Example:* A `Dependents` table (child name, age) is a weak entity set dependent on the `Employee` strong entity. If the employee leaves the company, their dependents' records are deleted automatically.

---

### 2.4 Cardinality Constraints (Mapping Constraints)
Cardinality defines the number of entity instances of one entity set that can be associated with entity instances of another set via a relationship.

1.  **One-to-One (1:1):** An instance in Entity Set A is associated with at most one instance in Entity Set B, and vice versa.
    *   *Example:* `Citizen` ── (1) ── [Has] ── (1) ── `Passport`.
2.  **One-to-Many (1:N):** An instance in A is associated with multiple instances in B, but an instance in B is associated with at most one instance in A.
    *   *Example:* `Department` ── (1) ── [Employs] ── (N) ── `Employee`.
3.  **Many-to-One (N:1):** Multiple instances in A are associated with at most one instance in B.
    *   *Example:* `Employee` ── (N) ── [Works_In] ── (1) ── `Department`.
4.  **Many-to-Many (M:N):** An instance in A is associated with multiple instances in B, and vice versa.
    *   *Example:* `Student` ── (M) ── [Enroll] ── (N) ── `Course`.

---

### 2.5 Participation Constraints
*   **Total Participation (Double Line):** Every entity in the entity set must participate in at least one relationship instance.
    *   *Example:* Every `Employee` **must** work in a `Department`.
*   **Partial Participation (Single Line):** Entities in the entity set may or may not participate in relationship instances.
    *   *Example:* Not every `Employee` is a manager of a `Department`.

---

### 2.6 Generalization, Specialization & Aggregation

*   **Generalization (Bottom-Up):** Combining multiple lower-level entity sets into one higher-level generalized entity set by extracting common attributes.
    *   *Example:* `Car` and `Truck` ➡ generalized into `Vehicle`.
*   **Specialization (Top-Down):** Defining sub-entity sets from a higher-level entity set by identifying distinguishing characteristics.
    *   *Example:* `Person` ➡ specialized into `Employee` and `Customer`.
*   **Aggregation:** A higher-level abstraction that treats a relationship between entities as a single abstract entity, enabling a relationship to participate in another relationship.
    *   *Example:* `Employee`-[Works_On]-`Project` relationship itself is treated as an entity to model which `Manager` oversees it.

---

### 2.7 ER Diagram to Relational Tables Conversion Rules
To translate a conceptual ER diagram into standard relational tables (RDBMS), follow these structural rules:

1.  **Strong Entity Set:** Map directly to a standalone table. All simple attributes become columns. Composite attributes are flattened (sub-parts become columns).
2.  **Weak Entity Set:** Map to a separate table. Columns include:
    *   All attributes of the weak entity set.
    *   The primary key of the identifying strong entity set (acting as a Foreign Key).
    *   *Primary Key of Weak Table:* Composite key combining (Strong Entity PK + Weak Entity Discriminator).
3.  **Relationship Sets (M:N):** Must create a distinct table.
    *   *Columns:* Primary keys of both participating entity sets + any descriptive attributes of the relationship.
    *   *Primary Key:* Composite key of both foreign keys.
4.  **Relationship Sets (1:N / N:1):** Do NOT create a separate table. Instead, take the primary key from the "One" side and add it as a **Foreign Key** in the "Many" side's table.
5.  **Relationship Sets (1:1):** No separate table. Put the primary key of either table into the other table as a foreign key. To prevent NULL values, choose the table with **total participation** to receive the foreign key.

---

## 🔑 Chapter 3: Functional Dependencies (FDs) & Key Extraction

Functional Dependency is the formal mathematical foundation used to evaluate schema design, calculate keys, and eliminate data redundancy.

### 3.1 Understanding Functional Dependency (FD)
An FD is represented as $X \rightarrow Y$ (Read: "$X$ functionally determines $Y$" or "$Y$ is functionally dependent on $X$").
*   **Definition:** If two tuples (rows) have identical values in attributes $X$, they must have identical values in attributes $Y$.
    *   If $t_1[X] = t_2[X]$, then $t_1[Y] = t_2[Y]$ must hold true.
*   **Trivial Dependency:** If the dependent (RHS) is a subset of the determinant (LHS).
    *   $X \rightarrow Y$ is trivial if $Y \subseteq X$ (e.g., $A, B \rightarrow A$ or $Id, Name \rightarrow Id$).
*   **Non-Trivial Dependency:** If the dependent is not a subset of the determinant.
    *   $X \rightarrow Y$ is non-trivial if $Y \not\subseteq X$ (e.g., $RollNumber \rightarrow Name$).
    *   It is **completely non-trivial** if $X \cap Y = \emptyset$.

---

### 3.2 Armstrong's Axioms (Inference Rules for FDs)
Armstrong's Axioms are the complete and sound set of inference rules used to derive all possible functional dependencies from a given set of FDs.

1.  **Reflexivity (Trivial Rule):** If $Y \subseteq X$, then $X \rightarrow Y$.
    *   *Example:* $\{Name, Age\} \rightarrow \{Name\}$ is always valid.
2.  **Augmentation:** If $X \rightarrow Y$, then $XZ \rightarrow YZ$ (adding the same attributes to both sides).
    *   *Example:* If $A \rightarrow B$, then $AC \rightarrow BC$.
3.  **Transitivity:** If $X \rightarrow Y$ and $Y \rightarrow Z$, then $X \rightarrow Z$.
    *   *Example:* If $RollNo \rightarrow Dept$ and $Dept \rightarrow HOD$, then $RollNo \rightarrow HOD$.

**Derived Rules (from the three axioms above):**
*   **Union:** If $X \rightarrow Y$ and $X \rightarrow Z$, then $X \rightarrow YZ$.
*   **Decomposition:** If $X \rightarrow YZ$, then $X \rightarrow Y$ and $X \rightarrow Z$.
*   **Pseudo-transitivity:** If $X \rightarrow Y$ and $WY \rightarrow Z$, then $WX \rightarrow Z$.

---

### 3.3 Attribute Closure ($X^+$)
The attribute closure of a set of attributes $X$ (denoted as $X^+$) is the complete set of all attributes in a relation that can be determined logically using the given set of Functional Dependencies.

#### 🧮 Step-by-Step Closure Algorithm
1.  Initialize $X^+ = X$.
2.  Loop through the list of FDs: If the Left-Hand Side (LHS) of any FD $A \rightarrow B$ is a subset of the current $X^+$, add the Right-Hand Side (RHS) $B$ to $X^+$.
3.  Repeat this process until no new attributes can be added to $X^+$.

> [!TIP]
> **Worked Example:**
> Let Relation $R(A, B, C, D, E)$ and FDs:
> 1. $A \rightarrow B$
> 2. $B \rightarrow C$
> 3. $C \rightarrow D$
> 4. $E \rightarrow A$
>
> Let's calculate the closure for $\{A\}$:
> *   Step 1: $A^+ = \{A\}$
> *   Using $A \rightarrow B$: $A^+ = \{A, B\}$
> *   Using $B \rightarrow C$: $A^+ = \{A, B, C\}$
> *   Using $C \rightarrow D$: $A^+ = \{A, B, C, D\}$
> *   $E \rightarrow A$ cannot be used because $E \not\subseteq A^+$.
> *   Result: $A^+ = \{A, B, C, D\}$. Since it does not contain $E$, $A$ alone is NOT a candidate key.

---

### 3.4 Keys in RDBMS
*   **Super Key:** A set of one or more attributes that, taken collectively, can uniquely identify a row in a table.
    *   *Condition:* If $X^+ = R$ (the entire relation's attributes), then $X$ is a Super Key.
*   **Candidate Key (CK):** A **minimal** Super Key. No proper subset of a candidate key can be a super key.
    *   *Condition:* $X$ is a Candidate Key if $X^+ = R$, and for any attribute $A \in X$, $(X - \{A\})^+ \neq R$.
*   **Primary Key (PK):** A candidate key selected by the database designer to uniquely identify records. Cannot accept NULL values.
*   **Prime Attribute:** An attribute that is a member of *any* Candidate Key.
*   **Non-Prime Attribute:** An attribute that is *not* a part of any Candidate Key.

---

### 3.5 Sanchit Sir's Cheat Code: Finding Candidate Keys Instantly
For GATE and semester exams, finding Candidate Keys of a relation $R$ under a set of FDs can be tedious. Use this shortcut:

```
                  ┌──────────────────────────────┐
                  │      Check FD list for:      │
                  └──────────────┬───────────────┘
         ┌───────────────────────┴───────────────────────┐
         ▼                                               ▼
┌─────────────────────────────────┐             ┌─────────────────────────────────┐
│ Attributes NEVER on the RHS     │             │ Attributes NEVER on the LHS     │
│ of any FD.                      │             │ of any FD.                      │
├─────────────────────────────────┤             ├─────────────────────────────────┤
│ ✔ Must be present in EVERY CK!  │             │ ✘ Will NEVER be part of any CK! │
└─────────────────────────────────┘             └─────────────────────────────────┘
```

1.  **Rule 1 (Essential Attributes):** Identify all attributes that only appear on the Left-Hand Side (LHS) or do not appear in any FDs. These attributes **MUST** be part of every candidate key.
2.  **Rule 2 (Useless Attributes):** Identify attributes that only appear on the Right-Hand Side (RHS). These will **NEVER** be part of any Candidate Key.
3.  **Step-by-step Application:**
    *   Find the closure of the "essential attributes".
    *   If the closure contains all attributes of $R$, then this set is the **one and only** Candidate Key.
    *   If the closure is incomplete, combine the essential attributes with other attributes (excluding RHS-only attributes) one by one, and calculate their closures to find all minimal keys.

> [!IMPORTANT]
> **Example Application:**
> Let $R(A, B, C, D, E, F)$ and FDs: $A \rightarrow B$, $C \rightarrow D$, $D \rightarrow E$, $B \rightarrow F$
>
> 1. LHS attributes: $A, C, D, B$ | RHS attributes: $B, D, E, F$
> 2. $A$ and $C$ are **never** on the RHS ➡ $\{A, C\}$ must be in every CK.
> 3. $(AC)^+ = \{A, C\} \rightarrow \{A, C, B\} \rightarrow \{A, C, B, D\} \rightarrow \{A, C, B, D, E\} \rightarrow \{A, C, B, D, E, F\} = R$
> 4. **Result:** $\{A, C\}$ is the **only Candidate Key**.

---

### 3.6 Canonical Cover (Minimal Cover)
A canonical cover $F_c$ is a simplified, minimal set of FDs that is logically equivalent to the original set $F$, with no redundant dependencies or extraneous attributes.

**Properties of Canonical Cover:**
- No FD in $F_c$ has an extraneous attribute on the LHS or RHS.
- No FD in $F_c$ can be removed without changing the closure of $F$.
- Each LHS of a FD in $F_c$ is unique.

**Algorithm to find Canonical Cover:**
1.  Apply the **Union rule** to combine FDs with the same LHS.
2.  Remove **extraneous (redundant) attributes** from the LHS of each FD.
    *   Attribute $A$ is extraneous in LHS of $X \rightarrow Y$ if $(X - \{A\})^+ \supseteq Y$.
3.  Remove **redundant FDs** — FDs that can be derived from the remaining set.
    *   FD $X \rightarrow Y$ is redundant if $X^+$ (computed using $F_c - \{X \rightarrow Y\}$) contains $Y$.

---

## ⚙️ Chapter 4: Database Normalization

Normalization is a systematic process of decomposing database tables to eliminate data redundancy and prevent operational anomalies.

### 4.1 Database Anomalies
If a database is not normalized, it suffers from three primary anomalies:
1.  **Insertion Anomaly:** Inability to insert certain data because other data is not yet available.
    *   *Example:* Cannot insert a new department's details until at least one employee is hired and assigned to it.
2.  **Deletion Anomaly:** The unintentional loss of data caused by the deletion of unrelated records.
    *   *Example:* Deleting the last employee of a department accidentally deletes all details of that department.
3.  **Update Anomaly:** Inconsistency that occurs when updating duplicate data in multiple rows.
    *   *Example:* If a department name changes, we must update it in every employee record. Missing even one row leads to inconsistent database states.

---

### 4.2 Hierarchy of Normal Forms
Database schemas are structured into progressively stricter normal forms. If a database is in BCNF, it is automatically in 3NF, 2NF, and 1NF.

```
         ┌─────────────────────────────────────────┐
         │     4NF (Multi-valued Dependencies)     │
         └─────────────────────────┬───────────────┘
                                   │ ⊆ (subset of)
         ┌─────────────────────────▼───────────────┐
         │   BCNF (Boyce-Codd Normal Form)         │
         └─────────────────────────┬───────────────┘
                                   │
         ┌─────────────────────────▼───────────────┐
         │        3NF (Third Normal Form)          │
         └─────────────────────────┬───────────────┘
                                   │
         ┌─────────────────────────▼───────────────┐
         │       2NF (Second Normal Form)          │
         └─────────────────────────┬───────────────┘
                                   │
         ┌─────────────────────────▼───────────────┐
         │        1NF (First Normal Form)          │
         └─────────────────────────────────────────┘
```

---

### 4.3 Detailed Rules of Normal Forms

#### 1️⃣ First Normal Form (1NF)
*   **Rule:** Every attribute (column) must contain only **atomic** (indivisible) values.
*   **Violations:** Multivalued attributes, composite attributes, or nested relations are not allowed.
*   *Solution:* Split multivalued records into separate rows or separate tables.

#### 2️⃣ Second Normal Form (2NF)
*   **Rule:** Must be in 1NF, and there must be **no Partial Dependency**.
*   **Partial Dependency:** Occurs when a non-prime attribute depends on a *proper subset* of a Candidate Key.
    *   Formally, $X \rightarrow Y$ is a partial dependency if $X$ is a proper subset of a Candidate Key, and $Y$ is a non-prime attribute.
    *   *Condition for 2NF:* No FD should look like:
        $$\text{Proper Subset of CK} \rightarrow \text{Non-Prime Attribute}$$
*   **Note:** If a relation has a single-attribute candidate key, it is automatically in 2NF (no partial dependency is possible).

#### 3️⃣ Third Normal Form (3NF)
*   **Rule:** Must be in 2NF, and there must be **no Transitive Dependency**.
*   **Transitive Dependency:** A non-prime attribute determines another non-prime attribute.
*   *Condition for 3NF:* For every non-trivial functional dependency $X \rightarrow Y$, **at least one** of the following conditions must hold:
    1.  $X$ is a **Super Key** (LHS is a key).
    2.  $Y$ is a **Prime Attribute** (RHS is part of some candidate key).

#### 4️⃣ Boyce-Codd Normal Form (BCNF)
*   **Rule:** A stricter version of 3NF.
*   *Condition for BCNF:* For every non-trivial functional dependency $X \rightarrow Y$:
    1.  $X$ must be a **Super Key** (LHS must be a key).
    *   *Note:* The 3NF escape hatch (where $Y$ can be a prime attribute) is removed here.

> [!WARNING]
> **3NF vs BCNF Trade-Off:**
> - **3NF** always guarantees both **lossless join** and **dependency preservation** after decomposition.
> - **BCNF** always guarantees **lossless join** but may **not preserve all functional dependencies**.
> - Always prefer BCNF for eliminating anomalies, but fall back to 3NF if dependency preservation is critical.

#### 5️⃣ Fourth Normal Form (4NF)
*   **Rule:** Must be in BCNF and have **no non-trivial Multi-valued Dependencies (MVDs)**.
*   **Multi-valued Dependency (MVD):** $X \twoheadrightarrow Y$ (X multi-determines Y) exists when for a given $X$, multiple independent sets of $Y$ and $Z$ values coexist.
    *   *Example:* A `Course` can have multiple `Teachers` AND multiple `Books`, independently. This causes unnecessary combinations of rows.
*   *Condition for 4NF:* For every non-trivial MVD $X \twoheadrightarrow Y$, $X$ must be a super key.

---

### 📊 Quick Comparison Matrix of Normal Forms

| Normal Form | Core Target | Rule Condition for $X \rightarrow Y$ | Lossless Join | FD Preservation |
| :--- | :--- | :--- | :--- | :--- |
| **1NF** | Atomic values | No multivalued attributes | Yes | Yes |
| **2NF** | Eliminate Partial Dependencies | $\text{Proper Subset of CK} \not\rightarrow \text{Non-Prime}$ | Yes | Yes |
| **3NF** | Eliminate Transitive Dependencies | $X$ is Super Key **OR** $Y$ is Prime | Yes | Yes ✅ |
| **BCNF** | Eliminate all FD anomalies | $X$ must be a Super Key | Yes | No ⚠️ |
| **4NF** | Eliminate MVD anomalies | $X$ is Super Key (for MVDs) | Yes | No ⚠️ |

---

### 4.4 Decomposition: Lossless Join & Dependency Preservation

**Decomposition** is the process of splitting a relation $R$ into smaller relations $R_1, R_2, \ldots$ to achieve a higher normal form.

#### Lossless Join Decomposition
A decomposition $\{R_1, R_2\}$ of $R$ is **lossless** if and only if:
$$R_1 \cap R_2 \rightarrow R_1 \quad \text{OR} \quad R_1 \cap R_2 \rightarrow R_2$$
This means the common attributes of $R_1$ and $R_2$ must form a **super key** of either $R_1$ or $R_2$.

#### Dependency Preserving Decomposition
A decomposition is **dependency preserving** if the union of the projected FDs on each sub-relation can together logically derive all the original FDs of $R$.
$$F_1 \cup F_2 \cup \ldots \equiv F$$

> [!CAUTION]
> BCNF decomposition is always **lossless** but **not always dependency preserving**. When BCNF causes loss of an FD, decompose into **3NF** instead using the **3NF Synthesis Algorithm** (based on the canonical cover).

---

## 🔍 Chapter 5: Indexing Techniques

Indexing is a data structure technique used to quickly locate and access the data in a database file without scanning the entire table block-by-block.

### 5.1 Single-Level Indexing Types
Depending on how the primary data file is organized and what attribute the index is built on, single-level indexes are divided into three types:

```
                          ┌──────────────────────────────┐
                          │       INDEXING TYPES         │
                          └──────────────┬───────────────┘
         ┌──────────────────────────────┼──────────────────────────────┐
         ▼                              ▼                              ▼
┌──────────────────┐           ┌──────────────────┐           ┌──────────────────┐
│  Primary Index   │           │ Clustered Index  │           │ Secondary Index  │
├──────────────────┤           ├──────────────────┤           ├──────────────────┤
│ • Ordered Data   │           │ • Ordered Data   │           │ • Unordered Data │
│ • Primary Key    │           │ • Non-Key Field  │           │ • Key/Non-Key    │
│ • Sparse Index   │           │ • Sparse Index   │           │ • Dense Index    │
└──────────────────┘           └──────────────────┘           └──────────────────┘
```

1.  **Primary Index:**
    *   **File Organization:** Ordered on the index field.
    *   **Index Key Field:** Primary Key (Unique).
    *   **Type:** Sparse Index (Typically stores the first record of every data block - known as a **Block Anchor**).
2.  **Clustered Index:**
    *   **File Organization:** Ordered on the index field.
    *   **Index Key Field:** Non-key field (values can repeat, e.g., `Dept_ID`).
    *   **Type:** Sparse Index. It groups records with the same key into blocks, pointing to the first block containing that key.
3.  **Secondary Index:**
    *   **File Organization:** Unordered data file.
    *   **Index Key Field:** Can be key or non-key.
    *   **Type:** Dense Index (Must contain a pointer for every single record in the data file because physical placement has no ordering).

---

### 5.2 Dense vs. Sparse Indexing
*   **Dense Index:**
    *   Contains an index record for **every single record** in the data search file.
    *   *Pros:* Extremely fast lookup.
    *   *Cons:* High storage space; updates to data require updating index structures immediately.
*   **Sparse Index:**
    *   Contains index records for only **some records** in the data file (typically block anchors).
    *   *Pros:* Requires much less memory; easy to update.
    *   *Cons:* Slower lookup (requires binary search on the index, finding the block, and scanning that block sequentially).

---

### 5.3 Multi-Level Indexing and B/B+ Trees
When the index table itself becomes so massive that it cannot fit into the physical RAM, a single-level index fails. We must build an index *on top of* the existing index, creating a multi-level indexing structure.

In modern databases, multi-level indexes are implemented using balanced trees:

```
         B-Tree Node Structure:                  B+ Tree Node Structure:
      ┌─────────────────────────┐             ┌─────────────────────────┐
      │   Key   │ Pointer │Data │             │   Key   │ Pointer │ NULL│
      │         │ (Child) │Ptr  │             │         │ (Child) │(No Data)
      └─────────────────────────┘             └─────────────────────────┘
      (Data pointers in all levels)           (Data pointers ONLY in Leaf nodes)
                                                 (Leaf nodes linked sequentially)
```

#### B-Tree vs. B+ Tree
*   **B-Tree:**
    *   Stores both search keys and data record pointers in all nodes (internal and leaf nodes).
    *   *Cons:* Internal nodes are larger, meaning fewer child pointers can fit in a single memory block, increasing the height of the tree.
*   **B+ Tree (Modern Standard):**
    *   Internal nodes store **only** search keys and child pointers (no data pointers).
    *   All actual data record pointers are stored strictly in the **leaf nodes**.
    *   Leaf nodes are linked together as a **doubly linked list**, allowing fast range queries and sequential scans.
    *   *Pros:* Maximizes block fan-out, minimizes search tree height, and drastically reduces disk read operations.

---

## 💻 Chapter 6: Structured Query Language (SQL)

Structured Query Language (SQL) is the standardized declarative interface used to define, manipulate, and query relational databases.

### 6.1 Classification of SQL Commands

```
                         ┌──────────────────────────────┐
                         │         SQL COMMANDS         │
                         └──────────────┬───────────────┘
         ┌──────────────────────┬───────┴───────┬──────────────────────┐
         ▼                      ▼               ▼                      ▼
   ┌───────────┐          ┌───────────┐   ┌───────────┐          ┌───────────┐
   │    DDL    │          │    DML    │   │    DCL    │          │    TCL    │
   ├───────────┤          ├───────────┤   ├───────────┤          ├───────────┤
   │ CREATE    │          │ SELECT    │   │ GRANT     │          │ COMMIT    │
   │ ALTER     │          │ INSERT    │   │ REVOKE    │          │ ROLLBACK  │
   │ DROP      │          │ UPDATE    │   └───────────┘          │ SAVEPOINT │
   │ TRUNCATE  │          │ DELETE    │                          └───────────┘
   └───────────┘          └───────────┘
```

1.  **DDL (Data Definition Language):** Defines, changes, and destroys the schema structures.
    *   *Commands:* `CREATE`, `ALTER`, `DROP`, `TRUNCATE`.
    *   *Note:* DDL operations are auto-committed instantly.
2.  **DML (Data Manipulation Language):** Handles data retrieval and modification.
    *   *Commands:* `SELECT`, `INSERT`, `UPDATE`, `DELETE`.
3.  **DCL (Data Control Language):** Controls permissions and security.
    *   *Commands:* `GRANT` (give access), `REVOKE` (take back access).
4.  **TCL (Transaction Control Language):** Manages database transactions.
    *   *Commands:* `COMMIT` (save changes), `ROLLBACK` (undo changes), `SAVEPOINT` (bookmark state).

---

### 6.2 Key Constraints and Referential Integrity
Constraints are rules enforced on data columns to ensure database reliability:

*   `PRIMARY KEY`: Uniquely identifies each record. Cannot contain NULL.
*   `UNIQUE`: Ensures all values are distinct. Can accept a single NULL value (or multiple, depending on DB engine).
*   `NOT NULL`: Prevents insertion of NULL values.
*   `CHECK`: Enforces conditional checks (e.g., `CHECK (Age >= 18)`).
*   `FOREIGN KEY`: Enforces Referential Integrity between parent and child tables.
    *   *Referential Integrity Violations (On Delete/Update of parent key):*
        *   `ON DELETE CASCADE`: Automatically deletes child records when parent is deleted.
        *   `ON DELETE SET NULL`: Sets child foreign key columns to NULL.
        *   `ON DELETE RESTRICT` / `NO ACTION`: Rejects the parent deletion if matching child records exist.

---

### 6.3 Relational Joins
Joins combine columns from one or more tables based on a common matching column.

```
      [LEFT Table]                    [RIGHT Table]
      ┌───────────┐                  ┌───────────┐
      │  A  │  B  │                  │  B  │  C  │
      ├─────┼─────┤                  ├─────┼─────┤
      │  1  │  x  │                  │  x  │ foo │
      │  2  │  y  │                  │  z  │ bar │
      └─────┴─────┘                  └─────┴─────┘
            │                              │
            └─────────── Join ─────────────┘
```

1.  **Inner Join (`INNER JOIN`):**
    *   Returns only the rows that have matching values in both tables.
    *   *Result for above:* `(1, x, foo)`
2.  **Left Outer Join (`LEFT OUTER JOIN`):**
    *   Returns all records from the left table, and the matched records from the right table. If no match, RHS columns return NULL.
    *   *Result for above:* `(1, x, foo)`, `(2, y, NULL)`
3.  **Right Outer Join (`RIGHT OUTER JOIN`):**
    *   Returns all records from the right table, and the matched records from the left table. If no match, LHS columns return NULL.
    *   *Result for above:* `(1, x, foo)`, `(NULL, z, bar)`
4.  **Full Outer Join (`FULL OUTER JOIN`):**
    *   Returns all records when there is a match in either left or right table. Unmatched records fill with NULL.
    *   *Result for above:* `(1, x, foo)`, `(2, y, NULL)`, `(NULL, z, bar)`
5.  **Natural Join:**
    *   Automatically joins on all columns that have the same name and data type in both tables. Eliminates duplicate columns in output.
6.  **Cross Join (Cartesian Product):**
    *   Returns every combination of rows from both tables. Result size = $|R_1| \times |R_2|$.

---

### 6.4 Aggregation & SQL Query Execution Order
Filtering records is handled differently before and after aggregation:

*   `WHERE`: Filters individual rows **before** groups are formed. It cannot contain aggregate functions (like `SUM`, `AVG`, `COUNT`).
*   `HAVING`: Filters groups **after** aggregation has occurred.

#### ⚙️ The Absolute Logical Order of Query Execution
Although written in a different order, database engines execute SQL statements in the following logical sequence:

```
  1. FROM (and JOINs)     ── Get table source and combine records
  2. WHERE                ── Filter individual rows
  3. GROUP BY             ── Group identical rows
  4. HAVING               ── Filter grouped rows
  5. SELECT               ── Select specific output columns
  6. DISTINCT             ── Remove duplicates
  7. ORDER BY             ── Sort results (ASC/DESC)
  8. LIMIT / OFFSET       ── Restrict output row count
```

---

### ✍️ SQL Cheat Sheet Queries

#### Creating a Table with Constraints
```sql
CREATE TABLE Employees (
    Emp_ID INT PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    Age INT CHECK (Age >= 18),
    Dept_ID INT,
    Salary DECIMAL(10, 2) DEFAULT 30000.00,
    FOREIGN KEY (Dept_ID) REFERENCES Departments(Dept_ID) 
        ON DELETE SET NULL
);
```

#### Fetching Employee Counts by Department (With Filtering)
```sql
SELECT Dept_ID, COUNT(Emp_ID) AS Total_Employees, AVG(Salary) AS Avg_Salary
FROM Employees
WHERE Salary > 20000
GROUP BY Dept_ID
HAVING COUNT(Emp_ID) >= 2
ORDER BY Avg_Salary DESC;
```

#### Using Subqueries
```sql
-- Find employees earning more than the average salary of the entire company
SELECT Name, Salary 
FROM Employees 
WHERE Salary > (SELECT AVG(Salary) FROM Employees);
```

---

## 🧮 Chapter 7: Relational Algebra & Relational Calculus

Relational Algebra and Relational Calculus are formal, mathematical query languages that form the theoretical foundation for SQL.

### 7.1 Relational Algebra (Procedural)
Relational Algebra is **procedural** — it specifies *how* to retrieve data by describing a sequence of operations.

#### Fundamental Operations

| Operation | Symbol | Description |
| :--- | :--- | :--- |
| **Select** | $\sigma$ | Filters rows (tuples) based on a condition. Equivalent to SQL `WHERE`. |
| **Project** | $\Pi$ | Selects specific columns (attributes). Equivalent to SQL `SELECT column_list`. |
| **Union** | $\cup$ | Combines tuples from two compatible relations. Removes duplicates. |
| **Set Difference** | $-$ | Returns tuples in $R_1$ that are NOT in $R_2$. |
| **Cartesian Product** | $\times$ | Combines every row from $R_1$ with every row from $R_2$. |
| **Rename** | $\rho$ | Renames a relation or its attributes. |

#### Join Operations (Derived from Cartesian Product + Select)

| Join Type | Symbol | Description |
| :--- | :--- | :--- |
| **Theta Join** | $R \bowtie_\theta S$ | Joins based on a specified condition $\theta$ (any comparison operator). |
| **Equi-Join** | $R \bowtie_{A=B} S$ | A Theta Join where the condition uses only equality (=). |
| **Natural Join** | $R \bowtie S$ | Auto-joins on all common attribute names; eliminates duplicate columns. |
| **Left Outer Join** | $R ⟕ S$ | All rows from $R$, with matching $S$ rows (unmatched $S$ cells = NULL). |
| **Right Outer Join** | $R ⟖ S$ | All rows from $S$, with matching $R$ rows. |
| **Full Outer Join** | $R ⟗ S$ | All rows from both $R$ and $S$ (unmatched cells = NULL). |

#### ✏️ Relational Algebra Query Examples
```
-- Find names of students enrolled in Course 'CS101'
π Name (σ Course='CS101' (Student ⋈ Enrollment))

-- Find employees with salary > 50000 in department 'IT'
π Name (σ Salary > 50000 AND Dept='IT' (Employee))

-- Find students enrolled in BOTH CS101 AND CS102
π StudentID (σ Course='CS101' (Enrollment)) ∩ π StudentID (σ Course='CS102' (Enrollment))
```

---

### 7.2 Relational Calculus (Declarative)
Relational Calculus is **declarative** — it specifies *what* data to retrieve, not how to get it. There are two types:

#### Tuple Relational Calculus (TRC)
*   Queries are written in the form: $\{T \mid P(T)\}$ where $T$ is the result tuple and $P(T)$ is the predicate condition.
*   Uses existential ($\exists$) and universal ($\forall$) quantifiers.

```
-- Find names of all students enrolled in CS101 (TRC)
{ t.Name | Student(t) ∧ ∃e (Enrollment(e) ∧ e.StudentID = t.ID ∧ e.Course = 'CS101') }
```

#### Domain Relational Calculus (DRC)
*   Queries use domain variables (values drawn from attribute domains, not whole tuples).
*   Written in the form: $\{<x_1, x_2, \ldots> \mid P(x_1, x_2, \ldots)\}$

```
-- Find names of students in CS101 (DRC)
{ <n> | ∃id (Student(id, n) ∧ ∃c Enrollment(id, c) ∧ c = 'CS101') }
```

#### TRC vs DRC vs Relational Algebra
| Feature | Relational Algebra | TRC | DRC |
| :--- | :--- | :--- | :--- |
| **Type** | Procedural | Declarative | Declarative |
| **Variables** | Relations (sets) | Tuples | Domain values |
| **Expressive Power** | Equal | Equal | Equal |
| **Basis for** | SQL DML | SQL conceptually | QBE (Query By Example) |

---

## 🔄 Chapter 8: Transaction Management & ACID Properties

A **Transaction** is a single logical unit of work that accesses and possibly modifies the contents of a database. It is a sequence of read ($r$) and write ($w$) operations.

### 8.1 ACID Properties
Every transaction must follow the ACID properties to guarantee data integrity:

```
┌──────────────────────────────────────────────────────────────┐
│                        A C I D                               │
│                                                              │
│  A – ATOMICITY      "All or Nothing"                         │
│  C – CONSISTENCY    "Valid state before and after"           │
│  I – ISOLATION      "Transactions don't interfere"           │
│  D – DURABILITY     "Committed changes are permanent"        │
└──────────────────────────────────────────────────────────────┘
```

1.  **Atomicity:**
    *   A transaction is treated as a single, indivisible unit of work. Either ALL operations in the transaction are executed successfully (committed), or NONE of them are (rolled back).
    *   *Managed by:* **Transaction Manager / Recovery Manager** (using undo logs).
    *   *Example:* In a bank transfer, both the debit from Account A and the credit to Account B must succeed together. If the credit fails, the debit is also undone.

2.  **Consistency:**
    *   A transaction must transform the database from one valid (consistent) state to another valid state, maintaining all defined integrity constraints (primary keys, foreign keys, check constraints).
    *   *Ensured by:* The application logic and the DBMS constraint enforcement engine.
    *   *Example:* After a transfer, the total balance across all accounts must remain the same.

3.  **Isolation:**
    *   Concurrent transactions must be executed as if they were running serially (one after another). Intermediate state of a transaction is not visible to other concurrent transactions.
    *   *Managed by:* **Concurrency Control Manager** (using locks, timestamps, MVCC).
    *   *Isolation Levels (from weakest to strongest):* Read Uncommitted, Read Committed, Repeatable Read, Serializable.

4.  **Durability:**
    *   Once a transaction has been committed, its changes are **permanent** and will survive even system failures (crashes, power outages).
    *   *Managed by:* **Recovery Manager** using **Write-Ahead Logging (WAL)** — changes are written to a log on persistent storage before being applied to the database.

---

### 8.2 Transaction States

```
            [BEGIN]
               │
               ▼
         ┌─────────┐     Read/Write     ┌──────────────────┐
         │  ACTIVE  │ ─────────────────► │ PARTIALLY COMMITTED│
         └─────────┘                    └──────────────────┘
               │                                  │
         Error │                         Checks Pass│
               ▼                                  ▼
         ┌─────────┐     Undo/Rollback   ┌──────────────────┐
         │  FAILED  │ ─────────────────► │    ABORTED        │
         └─────────┘                    └──────────────────┘
                                                  │
                                         Checks Pass│
                                                  ▼
                                        ┌──────────────────┐
                                        │    COMMITTED      │
                                        └──────────────────┘
```

*   **Active:** Transaction is currently executing (performing read/write operations).
*   **Partially Committed:** The last statement of the transaction has been executed. Final consistency checks are being run.
*   **Committed:** The transaction completed successfully. All changes are permanent.
*   **Failed:** An error was detected during execution. The transaction cannot proceed.
*   **Aborted:** The transaction was rolled back. The database is restored to the state before the transaction began.

---

### 8.3 Schedules & Serializability

A **Schedule** is a sequence of read and write operations from multiple concurrent transactions, ordered by time.

#### Types of Schedules
*   **Serial Schedule:** Transactions execute one after another without any interleaving. Always consistent. Low performance.
*   **Non-Serial (Concurrent) Schedule:** Transactions are interleaved. Higher performance, but risks inconsistency.
*   **Serializable Schedule:** A non-serial schedule that produces the same result as some serial schedule. The **gold standard** for correctness.

#### Conflict Serializability
Two operations **conflict** if they:
1.  Belong to **different transactions**, AND
2.  Access the **same data item**, AND
3.  At least one of them is a **write** operation.

**Conflict Pairs:**
- `Read-Write (R-W)` conflict
- `Write-Read (W-R)` conflict (Dirty Read)
- `Write-Write (W-W)` conflict (Lost Update)

**Conflict Equivalent Schedules:** Two schedules are conflict equivalent if one can be transformed into the other by swapping **non-conflicting** adjacent operations.

**Conflict Serializable Schedule:** A schedule is conflict serializable if it is conflict equivalent to some serial schedule.

#### Precedence Graph (Serialization Graph) Method
To test conflict serializability:
1.  Draw one node for each transaction.
2.  Draw a directed edge $T_i \rightarrow T_j$ if an operation of $T_i$ **conflicts with** and comes **before** an operation of $T_j$.
3.  If the precedence graph has **no cycles**, the schedule is **conflict serializable**.
4.  The topological ordering of the graph gives the equivalent serial schedule.

```
   Schedule: r1(A) w2(A) r1(B) w2(B) [Non-serial]
   
   Conflicts: r1(A) < w2(A) ➡ Edge: T1 → T2
              r1(B) < w2(B) ➡ Edge: T1 → T2
   
   Graph:  T1 ──► T2   (No cycle) ✅ Conflict Serializable
   Equivalent Serial Schedule: T1 → T2
```

#### View Serializability
*   A broader class than conflict serializability — every conflict serializable schedule is view serializable, but not vice versa.
*   A schedule $S$ is view serializable if it is view equivalent to a serial schedule $S'$.
*   **View Equivalence Conditions:** For every data item $Q$:
    1.  The same transaction performs the **initial read** of $Q$ in both schedules.
    2.  For each `write(Q)` in $S$, the same read follows it (same read-from relationship) in $S'$.
    3.  The same transaction performs the **final write** of $Q$ in both schedules.

---

### 8.4 Recoverability of Schedules

*   **Recoverable Schedule:** A schedule where, if a transaction $T_j$ reads data written by transaction $T_i$, then $T_i$ must commit **before** $T_j$ commits.
    *   Ensures that we can recover correctly if a committed transaction's value was read from an uncommitted one.
*   **Cascading Rollback (Cascadeless Schedule):** A recoverable schedule where a transaction can only read data written by **already committed** transactions.
    *   Avoids the need to roll back multiple transactions due to the failure of one.
*   **Strict Schedule:** A schedule where a transaction can neither read nor write a data item $Q$ until the transaction that last wrote $Q$ has committed or aborted.

```
Strictness: Strict ⊂ Cascadeless ⊂ Recoverable ⊂ All Schedules
```

---

## 🔒 Chapter 9: Concurrency Control

Concurrency control manages simultaneous transaction execution to preserve data integrity while maximizing system throughput.

### 9.1 Problems of Concurrent Execution

| Problem | Description | Example |
| :--- | :--- | :--- |
| **Lost Update** | Two transactions read and update the same value; the second overwrite destroys the first's update. | T1 and T2 both read Balance=1000. T1 adds 500 (→1500). T2 adds 200 (→1200). T1's update is lost! |
| **Dirty Read (W-R Conflict)** | A transaction reads data written by an **uncommitted** transaction. If that transaction aborts, the read was based on invalid data. | T1 transfers ₹500. T2 reads the new (₹1500) balance. T1 is aborted. T2 is working with invalid data. |
| **Unrepeatable Read (R-W)** | A transaction reads the same data item twice but gets different values because another transaction updated it between the two reads. | T1 reads Salary=50K. T2 updates Salary to 60K and commits. T1 reads Salary again — gets 60K, not 50K. |
| **Phantom Read** | A transaction re-executes a query and finds **new rows** (phantoms) that appeared because another concurrent transaction inserted them. | T1 counts students with GPA > 9. T2 inserts a new student with GPA 9.5. T1 recounts — gets a different number. |

---

### 9.2 Lock-Based Protocols

**Locks** are synchronization mechanisms used to control concurrent access to data items.

#### Types of Locks
*   **Shared Lock (S / Read Lock):** Allows a transaction to **read** a data item. Multiple transactions can hold a shared lock on the same item simultaneously.
*   **Exclusive Lock (X / Write Lock):** Allows a transaction to **read AND write** a data item. Only one transaction can hold an exclusive lock. No other lock (S or X) can be granted on the same item.

**Lock Compatibility Matrix:**

| | S Lock Requested | X Lock Requested |
| :--- | :--- | :--- |
| **S Lock Held** | ✅ Compatible (Grant) | ❌ Incompatible (Wait) |
| **X Lock Held** | ❌ Incompatible (Wait) | ❌ Incompatible (Wait) |

#### Two-Phase Locking (2PL)
2PL is the most widely used protocol to ensure **conflict serializability**.

**Rule:** A transaction must acquire ALL locks it needs before it releases ANY lock.

```
┌───────────────────────────────────────────────────┐
│              TWO PHASES OF 2PL                    │
│                                                   │
│  Phase 1: Growing Phase                           │
│  - Transaction can ACQUIRE locks (S or X).        │
│  - Transaction CANNOT release any lock.           │
│                                                   │
│  Lock Point: Maximum number of locks held.        │
│                                                   │
│  Phase 2: Shrinking Phase                         │
│  - Transaction can RELEASE locks.                 │
│  - Transaction CANNOT acquire any new lock.       │
└───────────────────────────────────────────────────┘
```

**Variants of 2PL:**
*   **Basic 2PL:** Standard growing + shrinking. Can cause **cascading rollbacks** (not strict).
*   **Strict 2PL:** All **exclusive locks** are held until the transaction commits or aborts. Prevents dirty reads. Most commonly used.
*   **Rigorous 2PL:** ALL locks (S and X) are held until commit/abort. Ensures strictness and simplifies recovery.
*   **Conservative (Static) 2PL:** All locks are acquired BEFORE the transaction begins. Prevents deadlocks but causes low concurrency.

> [!WARNING]
> **2PL guarantees serializability but does NOT prevent deadlocks.** Deadlocks occur when two or more transactions wait for each other to release locks (circular waiting). They are detected using **Wait-For Graphs (WFG)** — a cycle in the WFG indicates a deadlock.

---

### 9.3 Timestamp-Based Protocols

Instead of locks, each transaction is assigned a unique **timestamp** (TS) at the start. Ordering is based on this timestamp.

Each data item $Q$ maintains two values:
*   **W-timestamp(Q):** The largest timestamp of any transaction that has successfully written $Q$.
*   **R-timestamp(Q):** The largest timestamp of any transaction that has successfully read $Q$.

#### Timestamp Ordering (TO) Protocol Rules
*   **For a Read operation by $T_i$ on $Q$:**
    *   If $TS(T_i) < W\text{-timestamp}(Q)$: $T_i$ is trying to read a value already overwritten by a newer transaction. **Roll back $T_i$.**
    *   If $TS(T_i) \geq W\text{-timestamp}(Q)$: Execute the read, update $R\text{-timestamp}(Q) = \max(R\text{-timestamp}(Q), TS(T_i))$.

*   **For a Write operation by $T_i$ on $Q$:**
    *   If $TS(T_i) < R\text{-timestamp}(Q)$: A newer transaction has already read $Q$, so $T_i$'s write is outdated. **Roll back $T_i$.**
    *   If $TS(T_i) < W\text{-timestamp}(Q)$: A newer transaction has already written $Q$, so $T_i$'s write is outdated. **Roll back $T_i$.** *(Thomas Write Rule exception: can skip this write instead of rolling back!)*
    *   Otherwise: Execute the write, update $W\text{-timestamp}(Q) = TS(T_i)$.

#### Thomas Write Rule
*   A modification to the basic Timestamp Ordering protocol.
*   If $TS(T_i) < W\text{-timestamp}(Q)$, instead of rolling back $T_i$, simply **ignore/skip the write** because a newer transaction has already written a more recent value.
*   This allows more transactions to complete without unnecessary rollbacks.

---

### 9.4 Deadlock Handling

#### Deadlock Prevention
*   **Wait-Die (Non-preemptive):** If $T_i$ requests a lock held by $T_j$: If $TS(T_i) < TS(T_j)$ (Ti is older), $T_i$ **waits**. Else, $T_i$ **dies (aborted)**.
*   **Wound-Wait (Preemptive):** If $T_i$ requests a lock held by $T_j$: If $TS(T_i) < TS(T_j)$ (Ti is older), $T_i$ **wounds (aborts) $T_j$**. Else, $T_i$ **waits**.

| Protocol | Older Transaction | Younger Transaction |
| :--- | :--- | :--- |
| **Wait-Die** | Waits | Dies (aborted) |
| **Wound-Wait** | Wounds (kills younger) | Waits |

#### Deadlock Detection
*   Maintain a **Wait-For Graph (WFG)**.
*   Nodes = active transactions. Edge $T_i \rightarrow T_j$ = $T_i$ is waiting for $T_j$ to release a lock.
*   **Cycle in WFG = Deadlock detected.**
*   Resolution: Abort one or more transactions in the cycle (**victim selection**) and roll them back.

---

### 9.5 Isolation Levels (SQL Standard)

Different isolation levels trade off between consistency guarantees and concurrency performance:

| Isolation Level | Dirty Read | Unrepeatable Read | Phantom Read | Performance |
| :--- | :--- | :--- | :--- | :--- |
| **Read Uncommitted** | ✅ Possible | ✅ Possible | ✅ Possible | Highest |
| **Read Committed** | ❌ Prevented | ✅ Possible | ✅ Possible | High |
| **Repeatable Read** | ❌ Prevented | ❌ Prevented | ✅ Possible | Medium |
| **Serializable** | ❌ Prevented | ❌ Prevented | ❌ Prevented | Lowest |

---

## 📝 Quick Revision: High-Yield Formulas & Cheat Sheet

### Keys Formula Summary
```
Super Key ⊃ Candidate Key ⊃ Primary Key
Prime Attribute = Member of ANY Candidate Key
Non-Prime Attribute = NOT in any Candidate Key
```

### Normal Forms Summary
```
1NF: No multivalued / composite / nested attributes
2NF: 1NF + No (Proper Subset of CK → Non-Prime Attribute)
3NF: 2NF + Every FD: LHS is Super Key OR RHS is Prime Attr
BCNF: 3NF + Every FD: LHS MUST be Super Key (no exception)
4NF: BCNF + No non-trivial Multi-valued Dependencies
```

### Transaction Serializability Hierarchy
```
Serializable ⊂ Recoverable ⊂ Cascadeless ⊂ Strict
Conflict Serializable ⊂ View Serializable
```

### ACID → Who Manages What
```
Atomicity    → Transaction Manager + Recovery Manager (undo logs)
Consistency  → Application Logic + DBMS Constraints
Isolation    → Concurrency Control Manager (Locks / Timestamps)
Durability   → Recovery Manager (Write-Ahead Logging - WAL)
```
