import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
import sys
import json

# 입력 데이터 가져오기
input_data = json.loads(sys.stdin.readline())
targetId= sys.stdin.readline().strip()
# Bookshelf 정보
bookshelfs = input_data
# 사용자와 책 목록 생성
users = set(bs["userId"] for bs in bookshelfs)
books = set(bs["bookIsbn"] for bs in bookshelfs)

# 사용자-책 매트릭스 생성
matrix = np.zeros((len(users), len(books)))
user_map = {u: i for i, u in enumerate(users)} #사용자 id : index 
book_map = {b: j for j, b in enumerate(books)}

for bs in bookshelfs:
    user_idx = user_map[bs["userId"]]
    book_idx = book_map[bs["bookIsbn"]]
    matrix[user_idx, book_idx] += 1

# 사용자 간 코사인 유사도 계산
similarity_matrix = cosine_similarity(matrix)

# 특정 사용자와 가장 유사한 사용자 추출
user_idx = user_map[targetId]
similar_users = np.argsort(similarity_matrix[user_idx])[::-1][1:]  # 자기 자신을 제외한 가장 유사한 사용자들의 인덱스

# 추천 결과 생성
if similar_users.shape[0] < 1:
    print(json.dumps(""))
else:
    n = min(similar_users.shape[0], 1)
    recommended_user = ""
    for idx in similar_users[:n]:
        similar_user_id = next((u for u, i in user_map.items() if i == idx), None)
        recommended_user = similar_user_id
        #recommended_users.append(similar_user_id)

    # 결과 출력
    print(json.dumps(recommended_user))
