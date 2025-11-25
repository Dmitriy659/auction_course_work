import pandas as pd
from sklearn.preprocessing import StandardScaler
from sklearn.cluster import KMeans
from sklearn.metrics import silhouette_score
import matplotlib.pyplot as plt

df = pd.read_csv("stars.csv")

X = df.drop(columns=["TargetClass"])

if "SpType" in X.columns:
    X = pd.get_dummies(X, columns=["SpType"])

scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

inertia = []
K_range = range(1, 10)

for k in K_range:
    km = KMeans(n_clusters=k, random_state=42)
    km.fit(X_scaled)
    inertia.append(km.inertia_)

plt.figure(figsize=(8, 5))
plt.plot(K_range, inertia, marker="o")
plt.xlabel("Количество кластеров k")
plt.ylabel("Inertia (сумма квадратов расстояний)")
plt.title("Метод локтя")
plt.grid(True)
plt.show()

silhouette_scores = []

for k in range(2, 10):  # силуэт определён только для k ≥ 2
    km = KMeans(n_clusters=k, random_state=42)
    labels = km.fit_predict(X_scaled)
    score = silhouette_score(X_scaled, labels)
    silhouette_scores.append(score)
    print(f"k={k}, silhouette={score:.4f}")

plt.figure(figsize=(8, 5))
plt.plot(range(2, 10), silhouette_scores, marker="o")
plt.xlabel("Количество кластеров k")
plt.ylabel("Коэффициент силуэта")
plt.title("Анализ силуэта")
plt.grid(True)
plt.show()

# ===============================
# 6. Выбор оптимального k (например, максимальный силуэт)
# ===============================
best_k = range(2,10)[silhouette_scores.index(max(silhouette_scores))]
print(f"\nОптимальное количество кластеров (по силуэту): {best_k}")

# ===============================
# 7. Финальная кластеризация
# ===============================
kmeans = KMeans(n_clusters=best_k, random_state=42)
df["Cluster"] = kmeans.fit_predict(X_scaled)

print("\nКластеризация завершена! Первые строки:")
print(df.head())
