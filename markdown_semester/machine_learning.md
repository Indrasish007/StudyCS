# 🤖 Machine Learning (ML) — Ultimate Revision Notes

> **Source:** Based on the high-yield **"Complete ML Machine Learning in one shot | Semester Exam | Hindi"** One-Shot Lecture by Sanchit Jain (KnowledgeGate).

---

## 📌 Course Outline & Timestamps
- 🕒 **00:00 - 01:45** | Chapter 0: Introduction & Overview
- 🕒 **01:45 - 01:23:31** | [Chapter 1: Introduction to Machine Learning](#-chapter-1-introduction-to-machine-learning)
- 🕒 **01:23:31 - 02:31:11** | [Chapter 2: Regression & Bayesian Learning](#-chapter-2-regression--bayesian-learning)
- 🕒 **02:31:11 - 03:42:35** | [Chapter 3: Decision Tree Learning](#-chapter-3-decision-tree-learning)
- 🕒 **03:42:35 - 05:41:09** | [Chapter 4: Artificial Neural Networks (ANN)](#-chapter-4-artificial-neural-networks-ann)
- 🕒 **05:41:09 - End** | [Chapter 5: Reinforcement Learning](#-chapter-5-reinforcement-learning)

---

## 📁 Chapter 1: Introduction to Machine Learning

### 1.1 Defining Machine Learning
Machine Learning (ML) is a branch of Artificial Intelligence that enables computers to learn and improve from experience without being explicitly programmed. 

The industry-standard definition was formulated by **Tom M. Mitchell (1997)**:
> **Well-Posed Learning Problem:** A computer program is said to learn from experience $E$ with respect to some class of tasks $T$ and performance measure $P$, if its performance at tasks in $T$, as measured by $P$, improves with experience $E$.

#### 📊 Example Problems Defined by $(T, P, E)$

| Application / Problem | Task ($T$) | Performance ($P$) | Experience ($E$) |
| :--- | :--- | :--- | :--- |
| **Checkers Game** | Playing checkers | Percent of games won against opponents | Playing practice games against itself |
| **Handwriting Recognition** | Recognizing handwritten words within images | Percent of words correctly classified | Database of handwritten words with labels |
| **Robot Driving** | Driving on public highways using steering/pedals | Average distance traveled before human intervention | Sequence of camera images and steering commands recorded while observing human driving |
| **Spam Filtering** | Classifying emails as spam or ham | Fraction of emails correctly classified | Historical database of emails marked as spam or ham by users |

---

### 1.2 Designing a Learning System
Building an ML system involves a structured design pipeline. Let us trace this design pipeline using the **Checkers Game** as a running example:

```
┌──────────────────────────────────────────────┐
│        1. Choose Training Experience         │
│  (Direct vs Indirect, Self-play vs Teacher)  │
└──────────────────────┬───────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────┐
│         2. Choose Target Function            │
│  (V: BoardState -> Real Number Score/Rating) │
└──────────────────────┬───────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────┐
│     3. Choose Target Function Representation │
│   (V̂(b) = w₀ + w₁x₁ + w₂x₂ + ... + w₆x₆)     │
└──────────────────────┬───────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────┐
│         4. Choose Learning Algorithm         │
│     (LMS weight update: wᵢ ← wᵢ + η(E)xᵢ)    │
└──────────────────────────────────────────────┘
```

#### 1️⃣ Step 1: Choosing the Training Experience
The type of training data determines the capability and constraints of the learning system:
* **Direct vs. Indirect Feedback:** 
  * *Direct:* The agent receives immediate feedback on each move (e.g., whether a move is optimal).
  * *Indirect:* The agent only receives feedback at the end of the game (win, loss, or draw). Indirect feedback is much harder to learn from since the agent must solve the **credit assignment problem** (deciding which specific moves contributed to the final outcome).
* **Self-play vs. Teacher:**
  * *Teacher-Guided:* A teacher plays against the agent or provides optimal moves.
  * *Self-Play:* The agent plays against itself to generate training examples. It requires no human guidance but can explore slower.
* **Data Representativeness:** The training distribution must closely match the test distribution (e.g., if the agent only trains against itself, it might fail when playing against humans who employ different strategies).

#### 2️⃣ Step 2: Choosing the Target Function
We must mathematically define what the system needs to learn:
* Let $Board$ be the set of all possible checkers board states.
* We define a target function $V: Board \to \mathbb{R}$ that assigns a numerical score to any board state:
  * If $b$ is a final winning state: $V(b) = +100$
  * If $b$ is a final losing state: $V(b) = -100$
  * If $b$ is a final draw state: $V(b) = 0$
  * If $b$ is an intermediate state: $V(b) = V(b')$, where $b'$ is the optimal final state reachable from $b$.
* Since calculating $V(b)$ exactly for all states is computationally intractable, the learning system will attempt to learn an approximation function, denoted as $\hat{V}(b)$.

#### 3️⃣ Step 3: Choosing a Representation for the Target Function
We must represent $\hat{V}(b)$ in a form that the computer can compute and adjust. A simple and effective representation is a linear combination of board features:
$$\hat{V}(b) = w_0 + w_1 x_1 + w_2 x_2 + w_3 x_3 + w_4 x_4 + w_5 x_5 + w_6 x_6$$

Where:
* $x_1$: Number of black pieces on the board.
* $x_2$: Number of red pieces on the board.
* $x_3$: Number of black kings.
* $x_4$: Number of red kings.
* $x_5$: Number of black pieces threatened by red (can be captured in the next turn).
* $x_6$: Number of red pieces threatened by black.
* $w_0, w_1, \dots, w_6$: The weight coefficients to be learned.

#### 4️⃣ Step 4: Choosing the Learning Algorithm
To find the optimal weights, we need a learning algorithm that adjusts $w_i$ based on training instances.
* **Training Instances:** Formulated as pairs $\langle b, V_{train}(b) \rangle$. We estimate $V_{train}(b)$ using successor states:
  $$V_{train}(b) \leftarrow \hat{V}(Successor(b))$$
* **Least Mean Squares (LMS) Weight Update Rule:**
  For each training example $\langle b, V_{train}(b) \rangle$, the algorithm calculates the prediction error and adjusts weights in the direction that minimizes squared error:
  $$w_i \leftarrow w_i + \eta \left( V_{train}(b) - \hat{V}(b) \right) x_i$$
  where $\eta$ is a small positive constant called the **learning rate**.

---

### 1.3 Types of Learning
Machine learning problems are traditionally categorized based on the feedback mechanism:

```
                          ┌─────────────────────────┐
                          │   Learning Paradigms    │
                          └────────────┬────────────┘
         ┌─────────────────────────────┼─────────────────────────────┐
         ▼                             ▼                             ▼
┌─────────────────┐           ┌─────────────────┐           ┌─────────────────┐
│   Supervised    │           │  Unsupervised   │           │  Reinforcement  │
│ Labeled Data    │           │ Unlabeled Data  │           │ Feedback Loops  │
└────────┬────────┘           └────────┬────────┘           └─────────────────┘
    ┌────┴────┐                    ┌───┴───┐
    ▼         ▼                    ▼       ▼
Regression Classification     Clustering Association
```

* **Supervised Learning:** The training dataset consists of input-output pairs $(x^{(i)}, y^{(i)})$ where the labels $y^{(i)}$ are provided by a supervisor.
  * **Regression:** Predicts a continuous output (e.g., predicting house prices, temperature).
  * **Classification:** Predicts a discrete category/class (e.g., detecting spam vs. ham, recognizing digits).
* **Unsupervised Learning:** The dataset contains only inputs $x^{(i)}$ without any pre-defined labels. The goal is to discover underlying structures or distributions.
  * **Clustering:** Grouping similar data points together (e.g., customer segmentation using K-Means).
  * **Association Rule Learning:** Finding rules that describe relationships between variables (e.g., market basket analysis).
* **Reinforcement Learning:** The agent learns by interacting with an environment. It receives no direct labels but learns from a feedback loop of actions, states, and numerical **rewards/penalties**.
* **Semi-Supervised Learning:** Combines a small amount of labeled data with a large amount of unlabeled data to improve learning accuracy while reducing labeling costs.

---

### 1.4 Perspectives & Issues in Machine Learning
* **Hypothesis Space Bias:** What is the inductive bias of the learning algorithm? (e.g., linear regression assumes the relationship is linear).
* **Data Sufficiency:** How much training data is required for the model to generalize successfully without overfitting?
* **Overfitting vs. Underfitting:** Finding the optimal balance between model complexity and generalization.
* **Tractability and Scaling:** Can the algorithms scale to huge dimensional feature spaces and massive datasets?

---

## 📁 Chapter 2: Regression & Bayesian Learning

### 2.1 Regression Models
Regression algorithms model the relationship between dependent target variables and independent features.

#### 1️⃣ Simple Linear Regression
Simple Linear Regression predicts a continuous target $y$ from a single feature $x$ using a linear hypothesis:
$$h_\theta(x) = \theta_0 + \theta_1 x$$
* $\theta_0$: Y-intercept (bias term).
* $\theta_1$: Slope parameter.

##### 📉 Cost Function (Mean Squared Error - MSE)
To measure the inaccuracy of our parameters, we define a cost function $J(\theta_0, \theta_1)$ which averages the squared differences between predictions and actual values:
$$J(\theta_0, \theta_1) = \frac{1}{2m} \sum_{i=1}^{m} \left( h_\theta(x^{(i)}) - y^{(i)} \right)^2$$
*where $m$ is the total number of training examples.*

##### ⚡ Gradient Descent Optimization
To find the parameters $\theta_0$ and $\theta_1$ that minimize $J(\theta_0, \theta_1)$, we perform gradient descent. We update parameters simultaneously in the opposite direction of the gradient:
$$\theta_j \leftarrow \theta_j - \alpha \frac{\partial}{\partial \theta_j} J(\theta_0, \theta_1)$$
where $\alpha$ is the learning rate.

The partial derivatives (gradients) are calculated as:
$$\text{For } \theta_0: \quad \theta_0 \leftarrow \theta_0 - \alpha \frac{1}{m} \sum_{i=1}^{m} \left( h_\theta(x^{(i)}) - y^{(i)} \right)$$
$$\text{For } \theta_1: \quad \theta_1 \leftarrow \theta_1 - \alpha \frac{1}{m} \sum_{i=1}^{m} \left( h_\theta(x^{(i)}) - y^{(i)} \right) x^{(i)}$$

#### 2️⃣ Multiple Linear Regression
When predicting targets using $n$ different features, we define the hypothesis in vector form:
$$h_\theta(x) = \theta_0 + \theta_1 x_1 + \theta_2 x_2 + \dots + \theta_n x_n = \theta^T x$$
where $x_0 = 1$ is the dummy bias feature, enabling $\theta^T x = \sum_{j=0}^{n} \theta_j x_j$.

#### 3️⃣ Logistic Regression
Despite its name, **Logistic Regression is a classification algorithm** used to predict binary outcomes ($y \in \{0, 1\}$).

We map the linear combination $\theta^T x$ to a probability between $0$ and $1$ using the **Sigmoid (Logistic) Function**:
$$h_\theta(x) = g(\theta^T x) = \frac{1}{1 + e^{-\theta^T x}}$$

```
                      g(z) ▲
                           │       ┌───■ (1)
                           │     /
                           │    /
                           ┼───■ (0.5)
                         / │
                       /   │
             (0) ■────┴────┼────────────► z = θᵀx
```

##### 🎯 Decision Boundary
Since $h_\theta(x)$ represents the estimated probability $P(y=1 | x; \theta)$, we classify as follows:
$$\text{Predict } y = 1 \quad \text{if } h_\theta(x) \ge 0.5 \iff \theta^T x \ge 0$$
$$\text{Predict } y = 0 \quad \text{if } h_\theta(x) < 0.5 \iff \theta^T x < 0$$

---

### 2.2 Bayesian Learning
Bayesian learning provides a probabilistic approach to inference, treating parameters and hypotheses as random variables with prior beliefs.

#### 1️⃣ Bayes Theorem
$$P(h | D) = \frac{P(D | h) P(h)}{P(D)}$$
* $P(h)$: **Prior probability** of hypothesis $h$ (initial belief before looking at data).
* $P(D)$: **Prior probability** of observing data $D$.
* $P(D|h)$: **Likelihood** of observing data $D$ given hypothesis $h$.
* $P(h|D)$: **Posterior probability** of hypothesis $h$ given data $D$ (updated belief).

#### 2️⃣ Maximum A Posteriori (MAP) Hypothesis
The MAP hypothesis is the most probable hypothesis from the hypothesis space $H$, given the observed training data $D$:
$$h_{MAP} = \arg\max_{h \in H} P(h|D) = \arg\max_{h \in H} \frac{P(D|h)P(h)}{P(D)}$$

Since $P(D)$ is constant across all hypotheses, we can drop it:
$$h_{MAP} = \arg\max_{h \in H} P(D|h) P(h)$$

#### 3️⃣ Maximum Likelihood (ML) Hypothesis
If we assume that every hypothesis in $H$ is equally likely a priori ($P(h_i) = P(h_j)$ for all $i, j$), we only need to maximize the likelihood $P(D|h)$:
$$h_{ML} = \arg\max_{h \in H} P(D|h)$$

---

### 2.3 Naive Bayes Classifier
The Naive Bayes Classifier is a highly efficient classification algorithm based on Bayes Theorem.

#### 🧠 The "Naive" Assumption
It assumes that all features $A_1, A_2, \dots, A_n$ are **conditionally independent** given the target class label $V$:
$$P(A_1, A_2, \dots, A_n | V) = \prod_{i=1}^{n} P(A_i | V)$$

#### 🧮 Classification Formulation
To predict the class label $v_{NB}$ of an instance with attributes $a_1, a_2, \dots, a_n$:
$$v_{NB} = \arg\max_{v_j \in V} P(v_j | a_1, a_2, \dots, a_n) = \arg\max_{v_j \in V} \frac{P(a_1, a_2, \dots, a_n | v_j) P(v_j)}{P(a_1, a_2, \dots, a_n)}$$

Dropping the constant denominator:
$$v_{NB} = \arg\max_{v_j \in V} P(v_j) P(a_1, a_2, \dots, a_n | v_j)$$

Applying the conditional independence assumption:
$$v_{NB} = \arg\max_{v_j \in V} P(v_j) \prod_{i=1}^{n} P(a_i | v_j)$$

> [!TIP]
> **Dealing with Zero Probabilities (Laplace Smoothing):**
> If an attribute value $a_i$ never appears with class $v_j$ in the training data, then $P(a_i|v_j) = 0$, causing the entire product to become $0$. To fix this, we apply Laplace Smoothing:
> $$P(a_i | v_j) = \frac{n_c + 1}{n + |Domain(A_i)|}$$
> where $n_c$ is the count of class $v_j$ samples having feature value $a_i$, $n$ is total count of class $v_j$ samples, and $|Domain(A_i)|$ is the number of possible values of attribute $A_i$.

---

### 2.4 Bayesian Belief Networks (BBN)
While Naive Bayes assumes absolute conditional independence, Bayesian Belief Networks allow us to represent conditional dependencies selectively.

```
         ┌─────────────┐        ┌─────────────┐
         │   Rain (R)  │        │ Sprinkler(S)│
         └──────┬──────┘        └──────┬──────┘
                │                      │
                └──────────┬───────────┘
                           ▼
                    ┌─────────────┐
                    │ Wet Grass(W)│
                    └─────────────┘
```

#### 📁 Mathematical Formulation
A BBN is defined by:
1. A **Directed Acyclic Graph (DAG)** representing variables (nodes) and their causal relationships (edges).
2. A set of **Conditional Probability Tables (CPTs)** for each variable given its parents.

The joint probability of any combination of variables is calculated as:
$$P(x_1, x_2, \dots, x_n) = \prod_{i=1}^{n} P(x_i | Parents(x_i))$$

---

## 📁 Chapter 3: Decision Tree Learning

### 3.1 Representation & Concept
A Decision Tree is a flowchart-like tree structure representing a classification model:
* **Internal Nodes:** Represent tests on attributes.
* **Branches:** Represent outcomes of the attribute test.
* **Leaf Nodes:** Represent class labels or final decisions.

To classify a new instance, we start at the root node, test the attribute specified by the node, and move down the branch corresponding to the attribute value. This process repeats recursively until a leaf node is reached.

---

### 3.2 Mathematical Split Metrics
To build a decision tree, we must decide which attribute to split on at each node. We use information theory metrics:

#### 1️⃣ Entropy
Entropy measures the impurity or randomness of a collection of examples $S$:
$$Entropy(S) = - \sum_{i=1}^{c} p_i \log_2 p_i$$
*where $p_i$ is the proportion of examples in $S$ that belong to class $i$, and $c$ is the total number of classes.*

* **Binary Class Example:** If $S$ contains positive ($\oplus$) and negative ($\ominus$) labels:
  $$Entropy(S) = - p_\oplus \log_2 p_\oplus - p_\ominus \log_2 p_\ominus$$
* **Impurity Bounds:** 
  * If $S$ is homogeneous (all positive or all negative), $Entropy(S) = 0$.
  * If $S$ has an equal mix of positive and negative examples, $Entropy(S) = 1.0$.

#### 2️⃣ Information Gain
Information Gain measures the expected reduction in entropy achieved by partitioning the dataset $S$ based on attribute $A$:
$$Gain(S, A) = Entropy(S) - \sum_{v \in Values(A)} \frac{|S_v|}{|S|} Entropy(S_v)$$
* $Values(A)$: The set of all possible values for attribute $A$.
* $S_v$: The subset of $S$ for which attribute $A$ has value $v$.
* The goal is to choose the attribute $A$ that maximizes $Gain(S, A)$.

#### 3️⃣ Gini Index (Gini Impurity)
Used in CART (Classification and Regression Trees) as an alternative to Entropy:
$$Gini(S) = 1 - \sum_{i=1}^{c} p_i^2$$

---

### 3.3 The ID3 Algorithm
The **ID3 (Iterative Dichotomiser 3)** algorithm is a greedy algorithm that builds a decision tree top-down:

1. **Calculate the entropy** of the current dataset.
2. For each attribute, calculate the **Information Gain** on the dataset.
3. Select the attribute with the **highest Information Gain** to be the decision node.
4. Partition the dataset into subsets using the chosen attribute's values.
5. Repeat the process recursively for each subset.
6. **Stopping Conditions:**
   * All samples in the subset belong to the same class (create leaf node with that class).
   * No attributes are left to split (create leaf node with the majority class).
   * No samples are left in the subset (create leaf node with the parent's majority class).

---

### 3.4 Overfitting in Decision Trees
A decision tree can grow too deep, learning noise and random fluctuations in the training set instead of the general underlying pattern.

> **Formal Definition of Overfitting:**
> A hypothesis $h$ is said to overfit the training data if there exists an alternative hypothesis $h'$ such that:
> $$error_{train}(h) < error_{train}(h') \quad \text{and} \quad error_{test}(h) > error_{test}(h')$$

```
     Error ▲
           │
           │       /  Test/Validation Error (Overfitting starts here)
           │      /
           │     /  /───■
           │    /  /
           │   /  /
           │  /  /    ■──── Training Error
           │ /  /
           └─┴─┴──────────────────► Tree Depth / Complexity
```

#### 🛡️ Avoidance Strategies (Pruning)
To prevent overfitting, we prune the tree:

* **Pre-Pruning (Early Stopping):** Stop growing the tree before it reaches its maximum depth (e.g., stop if the number of samples in a node is below a threshold or if the Information Gain is not statistically significant).
* **Post-Pruning (Reduced Error Pruning):**
  1. Grow the tree to its maximum size.
  2. Evaluate the validation set performance.
  3. Recursively examine decision nodes starting from the leaves. For each node, collapse it into a leaf node (using majority class) and evaluate accuracy.
  4. If the collapsed tree performs as well or better on the validation set, keep the node pruned.
* **Rule Post-Pruning:**
  1. Convert the fully grown tree into a set of equivalent IF-THEN rules (one rule per path from root to leaf).
  2. Prune individual preconditions of each rule if it improves accuracy on validation set.
  3. Sort the pruned rules by accuracy and use them in that order to classify new instances.

---

## 📁 Chapter 4: Artificial Neural Networks (ANN)

### 4.1 Biological vs. Artificial Neuron
Artificial Neural Networks are loosely inspired by biological brains:

| Biological Neuron Component | Artificial Neural Network Equivalent | Function |
| :--- | :--- | :--- |
| **Dendrites** | Input channels ($x_1, x_2, \dots, x_n$) | Receives incoming signals from other neurons |
| **Synapses** | Weights ($w_1, w_2, \dots, w_n$) | Determines the strength/scaling of each input signal |
| **Soma (Cell Body)** | Summation block ($\sum w_i x_i + b$) | Aggregates all weighted inputs |
| **Axon / Synaptic Terminals**| Output signal ($o$) and Activation Function | Transmits the output signal to downstream neurons |

---

### 4.2 The Perceptron Model
A Perceptron is the fundamental building block of early neural networks, consisting of a single neuron with a step/threshold activation function:

```
  Inputs      Weights
   x₁ ────────► w₁ ───┐
   x₂ ────────► w₂ ───┼───► Sum: z = ∑ wᵢxᵢ + b ───► Activation [sgn(z)] ───► Output (o)
   ⋮                  │
   xₙ ────────► wₙ ───┘
```

#### 🧮 Mathematical Definition
$$o(x_1, \dots, x_n) = \begin{cases} 1 & \text{if } \sum_{i=1}^{n} w_i x_i + b > 0 \\ -1 & \text{otherwise} \end{cases}$$

Using a dummy input $x_0 = 1$ with weight $w_0 = b$ (bias):
$$o(\mathbf{x}) = sgn(\mathbf{w}^T \mathbf{x}) = \begin{cases} 1 & \text{if } \mathbf{w}^T \mathbf{x} > 0 \\ -1 & \text{otherwise} \end{cases}$$

#### 🔄 Perceptron Training Rule
To train a perceptron, we iteratively adjust the weights for each training sample $\langle \mathbf{x}, t \rangle$, where $t$ is the target label ($\pm 1$) and $o$ is the network output:
$$w_i \leftarrow w_i + \Delta w_i$$
$$\Delta w_i = \eta (t - o) x_i$$
*where $\eta > 0$ is the learning rate.*

> [!IMPORTANT]
> **Perceptron Convergence Theorem:**
> The Perceptron training rule is guaranteed to converge to a set of weights that perfectly classifies all training examples within a finite number of steps **IF and ONLY IF** the training data is **linearly separable** and the learning rate $\eta$ is sufficiently small.

#### ❌ The XOR Limitation
A single-layer perceptron can represent basic logical functions like AND, OR, and NAND because their classes can be separated by a straight line (linear decision boundary). However, it **cannot represent XOR** because XOR is non-linearly separable. This limitation was mathematically proven by **Minsky and Papert (1969)**, triggering the First AI Winter.

---

### 4.3 Activation Functions
To model non-linear boundaries, neural networks use non-linear activation functions:

* **Step Function (Threshold):**
  $$f(z) = \begin{cases} 1 & \text{if } z \ge 0 \\ 0 & \text{otherwise} \end{cases}$$
* **Sigmoid (Logistic) Function:**
  $$f(z) = \frac{1}{1 + e^{-z}}$$
  * *Range:* $(0, 1)$
  * *Derivative:* $f'(z) = f(z)(1 - f(z))$
* **Hyperbolic Tangent (Tanh):**
  $$f(z) = \tanh(z) = \frac{e^z - e^{-z}}{e^z + e^{-z}}$$
  * *Range:* $(-1, 1)$
  * *Derivative:* $f'(z) = 1 - f(z)^2$
* **Rectified Linear Unit (ReLU):**
  $$f(z) = \max(0, z)$$
  * *Range:* $[0, \infty)$
  * *Advantage:* Computationally highly efficient, prevents vanishing gradient problem in deep networks.

---

### 4.4 Multi-layer Perceptron (MLP) & Backpropagation
To solve non-linear problems like XOR, we stack neurons in multiple layers: **Input Layer**, **Hidden Layer(s)**, and **Output Layer**.

```
    Input Layer         Hidden Layer        Output Layer
     ┌──────┐            ┌──────┐            ┌──────┐
  x₁ │  ○   ├───────────►│  ○   ├───────────►│  ○   │──► Output
     └──────┘            └──────┘            └──────┘
     ┌──────┐            ┌──────┐
  x₂ │  ○   ├───────────►│  ○   │
     └──────┘            └──────┘
```

#### 📈 The Backpropagation Algorithm
The Backpropagation algorithm uses **Gradient Descent** to minimize the squared error over all output units:
$$E(\mathbf{w}) = \frac{1}{2} \sum_{k \in outputs} (t_k - o_k)^2$$

Because hidden nodes do not have direct target values $t$, the algorithm propagates errors backwards from the output layer to update hidden layer weights using the **Chain Rule**.

##### 🧮 Step-by-Step Derivation and Algorithm (using Sigmoid)

1. **Forward Pass:** Feed input vector $\mathbf{x}$ through the network to compute the activations of all hidden and output units.
2. **Compute Output Error ($\delta_k$):** For each output unit $k$, calculate the error term:
   $$\delta_k = \frac{\partial E}{\partial z_k} = o_k (1 - o_k) (t_k - o_k)$$
3. **Compute Hidden Error ($\delta_h$):** For each hidden unit $h$, calculate the error term by backpropagating the downstream output errors:
   $$\delta_h = o_h (1 - o_h) \sum_{k \in outputs} w_{kh} \delta_k$$
4. **Update Weights:** Adjust each weight coefficient $w_{ji}$ (from node $i$ to node $j$):
   $$w_{ji} \leftarrow w_{ji} + \Delta w_{ji}$$
   $$\Delta w_{ji} = \eta \delta_j x_{ji}$$
   *where $x_{ji}$ is the input from node $i$ into node $j$.*

---

## 📁 Chapter 5: Reinforcement Learning

### 5.1 Basic Framework
Reinforcement Learning models an agent interacting with an environment to learn a policy that maximizes cumulative rewards.

```
                    ┌───────────────┐
                    │  Environment  │
                    └─┬───────────▲─┘
     Current State s  │           │ Action a
     Current Reward r │           │
                    ┌─▼───────────┴─┐
                    │     Agent     │
                    └───────────────┘
```

* **State ($s_t$):** The current representation of the environment at time $t$.
* **Action ($a_t$):** The decision/move made by the agent.
* **Reward ($r_t$):** Numerical feedback received from the environment.
* **Policy ($\pi$):** A mapping from states to actions, $\pi(s) \to a$. The goal is to find the optimal policy $\pi^*$.

---

### 5.2 Markov Decision Processes (MDP)
To mathematically model the reinforcement learning environment, we use an MDP, defined as a 5-tuple $(S, A, P, R, \gamma)$:
* $S$: A finite set of states.
* $A$: A finite set of actions.
* $P(s' | s, a)$: Transition probability distribution (probability that taking action $a$ in state $s$ results in state $s'$).
* $R(s, a, s')$: Reward function (numerical reward received after transitioning from $s$ to $s'$ via action $a$).
* $\gamma \in [0, 1]$: Discount factor. A smaller $\gamma$ makes the agent shortsighted (valuing immediate rewards); a larger $\gamma$ makes it farsighted (valuing long-term rewards).

> **The Markov Property:**
> The future state transition depends only on the *current* state and *current* action, completely independent of the history of past states and actions:
> $$P(S_{t+1} = s_{t+1} | S_t = s_t, A_t = a_t, S_{t-1} = s_{t-1}, \dots) = P(S_{t+1} = s_{t+1} | S_t = s_t, A_t = a_t)$$

---

### 5.3 Value Functions
To evaluate how "good" a state or state-action pair is, we define two value functions:

#### 1️⃣ State-Value Function $V^\pi(s)$
The expected cumulative discounted reward starting from state $s$ and following policy $\pi$ thereafter:
$$V^\pi(s) = E_\pi \left[ \sum_{t=0}^{\infty} \gamma^t R_t \;\middle|\; S_0 = s \right]$$

#### 2️⃣ Action-Value Function $Q^\pi(s, a)$
The expected cumulative discounted reward starting from state $s$, taking action $a$, and following policy $\pi$ thereafter:
$$Q^\pi(s, a) = R(s, a) + \gamma \sum_{s'} P(s' | s, a) V^\pi(s')$$

---

### 5.4 Bellman Optimality Equation
The optimal value functions satisfy the recursive Bellman Optimality Equations:
$$V^*(s) = \max_{a \in A} \left[ R(s, a) + \gamma \sum_{s'} P(s' | s, a) V^*(s') \right]$$

$$Q^*(s, a) = R(s, a) + \gamma \sum_{s'} P(s' | s, a) \max_{a'} Q^*(s', a')$$

---

### 5.5 Q-Learning
Q-Learning is a **model-free, off-policy, temporal-difference** reinforcement learning algorithm. It allows an agent to learn the optimal action-value function $Q^*(s, a)$ directly without knowing transition probabilities $P(s' | s, a)$ or reward distributions beforehand.

#### 🔄 Q-Table Update Equation
For each step, after executing action $a$ in state $s$, receiving reward $R$, and transitioning to new state $s'$, we update our estimate:
$$Q(s, a) \leftarrow Q(s, a) + \alpha \left[ R(s, a) + \gamma \max_{a'} Q(s', a') - Q(s, a) \right]$$
*where $\alpha \in (0, 1]$ is the temporal difference learning rate.*

* **Temporal Difference (TD) Target:** $R(s, a) + \gamma \max_{a'} Q(s', a')$ (what we actually observed).
* **TD Error:** $\left( R(s, a) + \gamma \max_{a'} Q(s', a') - Q(s, a) \right)$ (difference between observation and prediction).

---

### 5.6 Exploration vs. Exploitation Trade-off
An RL agent faces a constant dilemma:
* **Exploitation:** Choosing the action that is currently estimated to have the highest Q-value (maximizing short-term rewards).
* **Exploration:** Choosing random or non-optimal actions to discover new paths and improve the accuracy of the Q-table (maximizing long-term rewards).

#### 🎲 The $\epsilon$-Greedy Strategy
To balance this trade-off, we choose actions as follows:
$$\text{Action } a = \begin{cases} \arg\max_{a'} Q(s, a') & \text{with probability } 1 - \epsilon \quad \text{(Exploit)} \\ \text{A random action from } A & \text{with probability } \epsilon \quad \text{(Explore)} \end{cases}$$
*Usually, $\epsilon$ starts high (e.g., $1.0$ for full exploration) and decays over time to settle into pure exploitation.*
