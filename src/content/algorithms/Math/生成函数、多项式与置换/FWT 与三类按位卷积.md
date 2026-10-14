---
kind: algorithm
title: FWT 与三类按位卷积
updated: 2026-10-12
status: draft
order: 1021500
tags:
  - 生成函数
  - 多项式
  - 群论
---

对于 $0\le s<2^m$，定义


$$
h_k^{\rm OR}=\sum_{i\,|\,j=k}a_ib_j,\quad h_k^{\rm AND}=\sum_{i\,\&\,j=k}a_ib_j,\quad h_k^{\rm XOR}=\sum_{i\,\oplus\,j=k}a_ib_j.
$$


在每个二元蝶形 $(u,v)$ 上，正变换分别为


$$
\operatorname{FWT}_{\rm OR}:(u,v)\mapsto(u,u+v),\quad\operatorname{FWT}_{\rm AND}:(u,v)\mapsto(u+v,v),
$$


$$
\operatorname{FWT}_{\rm XOR}:(u,v)\mapsto(u+v,u-v).
$$


逆变换：OR 为 $(u,v)\mapsto(u,v-u)$；AND 为 $(u,v)\mapsto(u-v,v)$；XOR 为 $(u,v)\mapsto((u+v)/2,(u-v)/2)$。XOR 逆变换要求 $2$ 可逆；特征 $2$ 的域不能直接这样处理。
