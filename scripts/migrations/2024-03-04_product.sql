-- public.product definition

-- Drop table

-- DROP TABLE public.product;

CREATE TABLE public.product (
	id uuid NOT NULL,
	"name" varchar NOT NULL,
	code varchar NOT NULL,
	last_modified timestamp NOT NULL,
	CONSTRAINT "PK_bebc9158e480b949565b4dc7a82" PRIMARY KEY (id)
);