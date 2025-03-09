import { Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from "@angular/core";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";
import { HttpClient } from "@angular/common/http";

@Component({
  selector: "app-short-feed",
  templateUrl: "./short-feed.component.html",
  styleUrls: ["./short-feed.component.scss"],
})
export class ShortFeedComponent {
  apiKey = "AIza/SyBpC_1cf5IWYzDBHGuPocjzKvA-wIGAsZA"; // Replace with your YouTube API key
  videos: any[] = [];
  filteredVideos: any[] = [];
  gridCols: number = 2;
  videoLoaded: boolean = false;
  iframeHeight: string = "48rem";
  userInterests: any=['angular','webdev','ai','automation js'];

  constructor(private sanitizer: DomSanitizer, private http: HttpClient) {}
  ngOnInit(): void {
    this.loadFromLocalStorage();
    this.fetchShorts();
    this.adjustIframeHeight();
  }
  
  adjustIframeHeight(): void {
    this.iframeHeight = "48rem"; // Larger height for desktop screens
  }
  // Load videos and interests from localStorage
  loadFromLocalStorage(): void {
    const storedVideos = localStorage.getItem("shortsFeed");
    const storedInterests = localStorage.getItem("userInterests");

    if (storedVideos) {
      this.videos = JSON.parse(storedVideos);
      this.filteredVideos = this.videos;
    }

    if (storedInterests) {
      this.filterVideosFromInterests(); // Filter based on previously stored interests
    }
  }
   // Filter videos based on stored interests
   filterVideosFromInterests(): void {
    if (this.userInterests.length > 0) {
      let filtered = this.videos;
      for (let interest of this.userInterests) {
        filtered = filtered.filter(
          (video) =>
            video.title.toLowerCase().includes(interest.toLowerCase()) ||
            (video.tags && video.tags.includes(interest))
        );
      }
      this.filteredVideos = filtered;
    }
  }
  // ✅ Fetch random YouTube Shorts
  fetchShorts(): void {
    const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&videoDuration=short&maxResults=10&key=${this.apiKey}`;
    this.videoLoaded = true;
    this.http.get(searchUrl).subscribe((res: any) => {
      this.videos = res.items.map((item: any) => ({
        id: item.id.videoId,
        title: item.snippet.title,
        tags: item.snippet.tags || [],
        thumbnail: item.snippet.thumbnails.medium.url,
      }));
      localStorage.setItem("shortsFeed", JSON.stringify(this.videos));
      this.filterVideos("Tech"); // ✅ Example filter
    });
  }

  // ✅ Filter based on tags or title

  // ##############alogrithem
  filterVideos(keyword: string): void {
    this.filteredVideos = this.videos.filter(
      (video) =>
        video.title.toLowerCase().includes(keyword.toLowerCase()) ||
        (video.tags && video.tags.includes(keyword))
    );

    // If no match, show random video
    if (this.filteredVideos.length === 0) {
      this.filteredVideos = [
        this.videos[Math.floor(Math.random() * this.videos.length)],
      ];
    }
  }

  // ✅ Sanitize the URL for embedding
  sanitizeURL(id: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(
      `https://www.youtube.com/embed/${id}?controls=0&iv_load_policy=3&showinfo=0&autoplay=1&modestbranding=1&rel=0`
    );
  }

  // ✅ Scroll snapping logic
  setupSnapScrolling(): void {
    const container = document.querySelector('.shorts-container') as HTMLElement;
    let isScrolling: any;
    container?.addEventListener('scroll', () => {
      window.clearTimeout(isScrolling);
      // When user stops scrolling, snap to closest video
      isScrolling = setTimeout(() => {
        this.snapToClosestVideo(container);
      }, 100); // Adjust delay for sensitivity
    });
  }

  @ViewChildren('videoItem') videoItems!: QueryList<ElementRef>;
  snapToClosestVideo(container: HTMLElement): void {
    const videos = this.videoItems.toArray();
    const scrollPosition = container.scrollTop;

    let closestIndex = 0;
    let closestDistance = Math.abs(scrollPosition - videos[0].nativeElement.offsetTop);

    videos.forEach((video, index) => {
      const distance = Math.abs(scrollPosition - video.nativeElement.offsetTop);
      if (distance < closestDistance) {
        closestIndex = index;
        closestDistance = distance;
      }
    });

    // ✅ Snap to closest video smoothly
    const targetVideo = videos[closestIndex].nativeElement;
    targetVideo.scrollIntoView({ behavior: 'smooth' });
  }

  
}

