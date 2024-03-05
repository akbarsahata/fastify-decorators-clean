-- public.farmer definition

-- Drop table

-- DROP TABLE public.farmer;

CREATE TABLE public.farmer (
	id uuid NOT NULL,
	"name" varchar NOT NULL,
	id_card_number varchar NOT NULL,
	birth_date date NOT NULL,
	created_at timestamp NOT NULL,
	updated_at timestamp NOT NULL,
	CONSTRAINT "PK_f356a29c5bf9598b298ea353c0e" PRIMARY KEY (id)
);