<template>
	<v-container>
		<h1 class="text-center">Contact API</h1>
		<p class="text-center">
			A minimal contact management system with a Java REST API, PostgreSQL
			storage, and a simple JavaScript UI for adding, viewing, and searching
			contacts.
		</p>
		<v-row class="d-block d-sm-flex my-1" justify="center">
			<v-col>
				<StatsAndChips repo="toomas633/contact-api" hide-chips />
			</v-col>
			<v-col sm="3" md="3" lg="2">
				<ButtonCard
					text="GitHub"
					href="https://github.com/Toomas633/contact-api"
					icon="mdi-github" />
			</v-col>
		</v-row>
		<v-divider
			thickness="2"
			class="border-opacity-100 mt-6 mb-4"
			color="primary" />
		<LinkableTitle h1 title="Requirements" centered />
		<p class="mb-4">
			Your client, who deals with managing secret contacts, has a problem. They
			urgently need a minimalist information system for this purpose. In
			discussions with the client and the architect, you all agree that this
			solution will not be long-term, but rather temporary, fulfilling only the
			minimal requirements.
		</p>
		<LinkableTitle h2 title="Client's requirements" />
		<ul class="ml-4">
			<li>Can view contact records.</li>
			<li>Can add new contact records.</li>
			<li>
				A contact record stores the contact's real name, secret code name, and
				phone number.
			</li>
			<li>The solution can be used through a web browser.</li>
		</ul>
		<v-divider thickness="2" class="border-opacity-100 mt-6 mb-4" />
		<LinkableTitle h2 title="Technical requirements" />
		<ul class="ml-4">
			<li>
				The information system must have a REST API that supports the JSON data
				format so that the solution can be integrated with other systems.
			</li>
			<li>Back-end technology is preferably Java.</li>
			<li>
				A JavaScript user interface that communicates with the system's REST API
				for adding and displaying records (no need to think about design or
				styling). A JavaScript framework of your choice may also be used.
			</li>
			<li>
				The solution must support contact names containing any possible symbols.
			</li>
			<li>
				System users and contact data are stored in a PostgreSQL database.
			</li>
			<li><b>Bonus:</b> The user can search for contacts.</li>
		</ul>
		<v-divider thickness="2" class="border-opacity-100 mt-6 mb-4" />
		<LinkableTitle h2 title="Final deliverable" />
		<ul class="ml-4">
			<li>
				The software code and the database model (for example, an SQL dump) must
				be delivered as a file.
			</li>
			<li>Instructions on how to run the software.</li>
		</ul>

		<v-divider
			thickness="2"
			class="border-opacity-100 mt-6 mb-4"
			color="primary" />
		<LinkableTitle h1 title="Solution" centered />
		<p>
			Java program files under <InlineCode code="src/main/java/App" /> . React
			website in <InlineCode code="src/" />.
		</p>
		<ul class="ml-4 mb-4">
			<li>
				<LinkComponent href="http://localhost:8000/get" /> displays information
				about the contact with the given ID in JSON format. Payload:
				<InlineCode code="id:value" />.
			</li>
			<li>
				<LinkComponent href="http://localhost:8000/add" />
				saves the information to the database when the payload is a user JSON
				object.
			</li>
			<li>
				<LinkComponent href="http://localhost:8000/search" />
				searches the database fields for the given value when the request
				payload is <InlineCode code="search:value" />
			</li>
			<li>
				<LinkComponent href="http://localhost:8000/delete" /> deletes the
				contact with the given ID when the request payload is
				<InlineCode code="id:value" />.
			</li>
		</ul>
		<LinkableTitle h2 title="JSON" />
		<p>JSON contact format for sending and receiving data:</p>
		<CodeBlock code="{id:10,nimi:'Test',salajane:'Test',tel:9812432}" />
		<v-divider thickness="2" class="border-opacity-100 mt-6 mb-4" />
		<LinkableTitle h2 title="Software" />
		<ul class="ml-4">
			<li>
				<LinkComponent href="https://www.java.com/en/" text="Java" /> (18)
			</li>
			<li>
				<LinkComponent href="https://www.postgresql.org/" text="PostgreSQL" />
			</li>
			<li>
				<LinkComponent href="https://nodejs.org/en" text="Node.js" />
			</li>
		</ul>
		<v-divider thickness="2" class="border-opacity-100 mt-6 mb-4" />
		<LinkableTitle h2 title="Database" />
		<ul class="ml-4">
			<li>Database dump: <InlineCode code="smit.sql" /></li>
			<li>Database configuration in file: <InlineCode code="DB.java" /></li>
			<li>Test data is randomly generated with ChatGPT.</li>
		</ul>
		<v-divider
			thickness="2"
			class="border-opacity-100 mt-6 mb-4"
			color="primary" />
		<LinkableTitle h1 title="Running" centered />
		<p>
			Run the program using <InlineCode code="java -jar test.jar" /> and the API
			is exposed on <LinkComponent href="http:localhost:8000" />.<br />
			Webpage: <InlineCode code="npm install -g serve" /> and
			<InlineCode code="serve -s build" /> at address
			<LinkComponent href="http:localhost:3000" />
			If .jar is not working you can also use
			<LinkComponent text="Maven" href="https://maven.apache.org/" /> or run the
			<InlineCode code="App.java" /> file directly:
			<CodeBlock code="mvn clean install" />
			<br />
			<CodeBlock code="java -jar target/test-0.1.jar" />
		</p>
	</v-container>
	<TableOfContents />
</template>
