import pandas as pd
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.cluster import DBSCAN
import matplotlib.pyplot as plt
import seaborn as sns

# Предположим, что df уже загружен, как в твоем описании
df = pd.read_csv('stars.csv')

# Кодируем категориальный признак SpType
le = LabelEncoder()
df['SpType_encoded'] = le.fit_transform(df['SpType'])

# Выбираем признаки для кластеризации
features = ['Vmag', 'Plx', 'e_Plx', 'B-V', 'Amag', 'SpType_encoded']
X = df[features]

# Масштабируем данные
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# DBSCAN
dbscan = DBSCAN(eps=3, min_samples=5)  # eps и min_samples можно подбирать
clusters = dbscan.fit_predict(X_scaled)

# Добавляем кластеры в датафрейм
df['DBSCAN_cluster'] = clusters

# Посмотрим распределение по кластерам
print(df['DBSCAN_cluster'].value_counts())

# Визуализация (например, по двум первым компонентам)
plt.figure(figsize=(10, 6))
sns.scatterplot(x=X_scaled[:, 0], y=X_scaled[:, 1], hue=clusters, palette='tab10', legend='full')
plt.title('DBSCAN кластеризация')
plt.xlabel('Vmag')
plt.ylabel('Plx')
plt.show()
