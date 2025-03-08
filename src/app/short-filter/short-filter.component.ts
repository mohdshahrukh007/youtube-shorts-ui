import { Component, OnInit } from '@angular/core';

interface TechVideo {
  id: number;
  title: string;
  creator: string;
  creatorAvatar: string;
  skillLevel: 'beginner' | 'intermediate' | 'advanced';
  techTags: string[];
  likes: number;
  dislikes: number;
  comments: number;
  thumbnailUrl: string;
}
 
@Component({
  selector: 'app-short-filter',
  templateUrl: './short-filter.component.html',
  styleUrls: ['./short-filter.component.scss']
})

export class ShortFilterComponent implements OnInit {
  videos: TechVideo[] = [];
  filteredVideos: TechVideo[] = [];
  showFilters: boolean=false;
  toggleFilters() {
    this.showFilters = !this.showFilters;
  }
  // Filter state
  selectedTechnology: string = 'Web Dev';
  selectedSkillLevel: string = 'beginner';
  selectedContentType: string = 'Tutorials';
  maxDuration: number = 90;
  
  // Available filter options
  technologies: string[] = ['Web Dev', 'Mobile Dev', 'AI/ML', 'DevOps', 'Cybersecurity', 'Data Science'];
  skillLevels: string[] = ['beginner', 'intermediate', 'advanced'];
  contentTypes: string[] = ['Tutorials', 'Reviews', 'News', 'Tips & Tricks'];
  
  constructor() { }

  ngOnInit(): void {
    // Mock data - in a real app, this would come from a service
    this.videos = [
      {
        id: 1,
        title: '5 React.js Hooks Every Developer Should Know',
        creator: 'TechGuru',
        creatorAvatar: 'assets/avatars/tech-guru.jpg',
        skillLevel: 'intermediate',
        techTags: ['React', 'JavaScript', 'Web Dev'],
        likes: 24000,
        dislikes: 156,
        comments: 345,
        thumbnailUrl: 'assets/thumbnails/react-hooks.jpg'
      },
      {
        id: 2,
        title: 'Docker in 60 Seconds - Essential Commands',
        creator: 'DevOpsDaily',
        creatorAvatar: 'assets/avatars/devops-daily.jpg',
        skillLevel: 'beginner',
        techTags: ['Docker', 'DevOps', 'CLI'],
        likes: 15000,
        dislikes: 82,
        comments: 213,
        thumbnailUrl: 'assets/thumbnails/docker-commands.jpg'
      },
      {
        id: 3,
        title: 'Advanced TensorFlow Techniques for Computer Vision',
        creator: 'AI Explorer',
        creatorAvatar: 'assets/avatars/ai-explorer.jpg',
        skillLevel: 'advanced',
        techTags: ['TensorFlow', 'AI/ML', 'Computer Vision'],
        likes: 32000,
        dislikes: 145,
        comments: 502,
        thumbnailUrl: 'assets/thumbnails/tensorflow-cv.jpg'
      }
    ];
    
    this.applyFilters();
  }
  
  applyFilters(): void {
    this.filteredVideos = this.videos.filter(video => {
      // Filter by technology
      if (!video.techTags.includes(this.selectedTechnology) &&
          !video.techTags.some(tag => tag.includes(this.selectedTechnology))) {
        return false;
      }
      
      // Filter by skill level
      if (video.skillLevel !== this.selectedSkillLevel) {
        return false;
      }
      
      // In a real app, we would also filter by content type and duration
      
      return true;
    });
  }
  
  selectTechnology(tech: string): void {
    this.selectedTechnology = tech;
    this.applyFilters();
  }
  
  selectSkillLevel(level: string): void {
    this.selectedSkillLevel = level as 'beginner' | 'intermediate' | 'advanced';
    this.applyFilters();
  }
  
  selectContentType(type: string): void {
    this.selectedContentType = type;
    this.applyFilters();
  }
  
  updateDuration(event: any): void {
    this.maxDuration = event.target.value;
    this.applyFilters();
  }
  
  formatNumber(num: number): string {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  }
}