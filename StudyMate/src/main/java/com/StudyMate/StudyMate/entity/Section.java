package com.StudyMate.StudyMate.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "sections")
public class Section {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "title")
    private String title; // Tên chương (VD: Chương 1: Thì hiện tại đơn)

    @Column(name = "order_index")
    private Integer orderIndex; // Thứ tự hiển thị (1, 2, 3...)

    @ManyToOne
    @JoinColumn(name = "course_id")
    private Course course;

    // Quan hệ: 1 Chương có nhiều Bài học
    @OneToMany(mappedBy = "section", cascade = CascadeType.ALL)
    private List<Lesson> lessons;
}
