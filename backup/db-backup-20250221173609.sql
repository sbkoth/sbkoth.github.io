--
-- PostgreSQL database dump
--

-- Dumped from database version 16.8
-- Dumped by pg_dump version 16.5

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: blog_posts; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.blog_posts (
    id integer NOT NULL,
    slug text NOT NULL,
    title text NOT NULL,
    excerpt text NOT NULL,
    content text NOT NULL,
    published_at timestamp without time zone DEFAULT now() NOT NULL,
    thumbnail text NOT NULL
);


ALTER TABLE public.blog_posts OWNER TO neondb_owner;

--
-- Name: blog_posts_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.blog_posts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.blog_posts_id_seq OWNER TO neondb_owner;

--
-- Name: blog_posts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.blog_posts_id_seq OWNED BY public.blog_posts.id;


--
-- Name: profile; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.profile (
    id integer NOT NULL,
    name text NOT NULL,
    title text NOT NULL,
    bio text NOT NULL,
    avatar text NOT NULL,
    socials jsonb NOT NULL
);


ALTER TABLE public.profile OWNER TO neondb_owner;

--
-- Name: profile_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.profile_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.profile_id_seq OWNER TO neondb_owner;

--
-- Name: profile_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.profile_id_seq OWNED BY public.profile.id;


--
-- Name: projects; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.projects (
    id integer NOT NULL,
    slug text NOT NULL,
    title text NOT NULL,
    description text NOT NULL,
    content text NOT NULL,
    published_at timestamp without time zone DEFAULT now() NOT NULL,
    thumbnail text NOT NULL,
    type text NOT NULL,
    challenge text,
    approach text,
    implementation text,
    outcomes jsonb,
    client_testimonial jsonb,
    technologies jsonb,
    CONSTRAINT projects_type_check CHECK ((type = ANY (ARRAY['image'::text, 'pdf'::text, 'slides'::text, 'text'::text])))
);


ALTER TABLE public.projects OWNER TO neondb_owner;

--
-- Name: projects_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.projects_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.projects_id_seq OWNER TO neondb_owner;

--
-- Name: projects_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.projects_id_seq OWNED BY public.projects.id;


--
-- Name: session; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.session (
    sid character varying NOT NULL,
    sess json NOT NULL,
    expire timestamp(6) without time zone NOT NULL
);


ALTER TABLE public.session OWNER TO neondb_owner;

--
-- Name: blog_posts id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.blog_posts ALTER COLUMN id SET DEFAULT nextval('public.blog_posts_id_seq'::regclass);


--
-- Name: profile id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.profile ALTER COLUMN id SET DEFAULT nextval('public.profile_id_seq'::regclass);


--
-- Name: projects id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.projects ALTER COLUMN id SET DEFAULT nextval('public.projects_id_seq'::regclass);


--
-- Data for Name: blog_posts; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.blog_posts (id, slug, title, excerpt, content, published_at, thumbnail) FROM stdin;
27	welcome	Welcome to My Blog	This is my first blog post about technology and architecture	<h1>Welcome to My Technical Blog</h1>\n<p>As a Technical Architect with over 12 years of experience in the industry, I&#39;m excited to share my insights and experiences with you. This blog will focus on:</p>\n<ul>\n<li>Advanced data storage solutions</li>\n<li>Cloud platforms and architecture</li>\n<li>Data governance best practices</li>\n<li>System scalability and optimization</li>\n</ul>\n<p>Stay tuned for more content!</p>\n	2024-02-21 00:00:00	/uploads/1740109013236-profile-photo.jpg
\.


--
-- Data for Name: profile; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.profile (id, name, title, bio, avatar, socials) FROM stdin;
1	Srinivas Kothapalli	Technical Architect	Seasoned technologist with 12+ years in advanced data storage, cloud platforms, and data governance, architecting scalable, cost-efficient systems for business success.	/uploads/1740109013236-profile-photo.jpg	{"x": "sbkoth", "email": "bobby@prameya.legal", "github": "sbkoth", "linkedin": "sbkoth"}
\.


--
-- Data for Name: projects; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.projects (id, slug, title, description, content, published_at, thumbnail, type, challenge, approach, implementation, outcomes, client_testimonial, technologies) FROM stdin;
46	data-governance	Data Governance Framework	A comprehensive data governance framework implementation for enterprise data management	<h1>Enterprise Data Governance Framework</h1>\n<h2>Overview</h2>\n<p>This project established a robust data governance framework for a Fortune 500 company, focusing on:</p>\n<ul>\n<li>Data quality assurance</li>\n<li>Regulatory compliance</li>\n<li>Data lifecycle management</li>\n<li>Security and access control</li>\n</ul>\n<h2>Key Achievements</h2>\n<ol>\n<li>Implemented automated data quality checks</li>\n<li>Established data stewardship program</li>\n<li>Created comprehensive data catalog</li>\n<li>Reduced data-related incidents by 75%</li>\n</ol>\n<h2>Technologies Used</h2>\n<ul>\n<li>AWS Glue for data catalog</li>\n<li>Apache Atlas for metadata management</li>\n<li>Custom data quality tools</li>\n<li>Tableau for data quality dashboards</li>\n</ul>\n	2024-02-21 00:00:00	/uploads/1740109013236-profile-photo.jpg	text	\N	\N	\N	\N	\N	\N
47	example-project	Cloud Migration Strategy	Enterprise-scale cloud migration framework and implementation strategy	<h1>Cloud Migration Framework</h1>\n<h2>Overview</h2>\n<p>This project delivered a comprehensive cloud migration strategy for a large enterprise, focusing on:</p>\n<ul>\n<li>Infrastructure modernization</li>\n<li>Cost optimization</li>\n<li>Zero-downtime migration</li>\n<li>Security compliance</li>\n</ul>\n<h2>Key Achievements</h2>\n<ol>\n<li>Successfully migrated 200+ applications</li>\n<li>Reduced infrastructure costs by 40%</li>\n<li>Implemented automated deployment pipelines</li>\n<li>Achieved 99.99% uptime during migration</li>\n</ol>\n<h2>Technologies Used</h2>\n<ul>\n<li>AWS CloudFormation</li>\n<li>Terraform</li>\n<li>Docker</li>\n<li>Kubernetes</li>\n<li>Jenkins</li>\n</ul>\n	2024-02-21 00:00:00	/uploads/1740109013236-profile-photo.jpg	text	\N	\N	\N	\N	\N	\N
\.


--
-- Data for Name: session; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.session (sid, sess, expire) FROM stdin;
\.


--
-- Name: blog_posts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.blog_posts_id_seq', 27, true);


--
-- Name: profile_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.profile_id_seq', 1, true);


--
-- Name: projects_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.projects_id_seq', 47, true);


--
-- Name: blog_posts blog_posts_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.blog_posts
    ADD CONSTRAINT blog_posts_pkey PRIMARY KEY (id);


--
-- Name: blog_posts blog_posts_slug_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.blog_posts
    ADD CONSTRAINT blog_posts_slug_key UNIQUE (slug);


--
-- Name: profile profile_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.profile
    ADD CONSTRAINT profile_pkey PRIMARY KEY (id);


--
-- Name: projects projects_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT projects_pkey PRIMARY KEY (id);


--
-- Name: projects projects_slug_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT projects_slug_key UNIQUE (slug);


--
-- Name: session session_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.session
    ADD CONSTRAINT session_pkey PRIMARY KEY (sid);


--
-- Name: IDX_session_expire; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "IDX_session_expire" ON public.session USING btree (expire);


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: cloud_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE cloud_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO neon_superuser WITH GRANT OPTION;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: cloud_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE cloud_admin IN SCHEMA public GRANT ALL ON TABLES TO neon_superuser WITH GRANT OPTION;


--
-- PostgreSQL database dump complete
--

