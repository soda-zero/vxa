
export type Posts = Post[];
export interface Post {
id: string;
title: string,
tags: string;
created_at: number;
shortcode: string;
dimensions: Dimensions;
img_src: string;
}

export interface Dimensions {
height: number;
width: number;
}
