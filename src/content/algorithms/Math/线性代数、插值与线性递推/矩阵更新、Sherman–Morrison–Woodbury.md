---
kind: algorithm
title: 矩阵更新、Sherman–Morrison–Woodbury
updated: 2026-10-12
status: draft
order: 1040400
tags:
  - 线性代数
  - 线性递推
---

$A$、$I+V^TA^{-1}U$ 均可逆时，


$$
(A+UV^T)^{-1}=A^{-1}-A^{-1}U(I+V^TA^{-1}U)^{-1}V^TA^{-1}.
$$


秩一版本：


$$
(A+uv^T)^{-1}=A^{-1}-\frac{A^{-1}uv^TA^{-1}}{1+v^TA^{-1}u},
$$


要求分母非零。行列式引理见树图计数章节。
